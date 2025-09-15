// server/vite.ts  (replace existing file)
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * setupVite - attaches Vite middleware in development only.
 *
 * IMPORTANT:
 * - This function dynamically imports 'vite' at runtime in dev mode,
 *   so that TypeScript / tsc won't include vite.config.ts into the server
 *   production build and won't require ESM import.meta support.
 */
export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "development") {
    // Nothing to do in production
    return;
  }

  // dynamic import - only happens in development runtime
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    // allowedHosts to support remote dev if required
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    // do not reference ../vite.config (avoids pulling vite.config.ts into server tsc)
    // provide the minimal config inline for dev middleware
    configFile: false,
    server: serverOptions,
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error: (msg: any, options?: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use process.cwd() (project root) instead of import.meta.dirname
      const projectRoot = process.cwd();
      const clientTemplate = path.resolve(projectRoot, "client", "index.html");

      // read index.html from the client directory
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * serveStatic - used in production to serve built client files.
 * We use process.cwd() to locate the expected client build output.
 */
export function serveStatic(app: Express) {
  // this assumes Vite build outputs root/dist/public or similar.
  // Adjust if your Vite outDir is different.
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if file not found
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export { log };
