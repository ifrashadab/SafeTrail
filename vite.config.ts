// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Safe Vite config:
 * - Exports an async config function so we can dynamically import ESM-only plugins at runtime (dev).
 * - Uses process.cwd() instead of import.meta.dirname to avoid ESM-only syntax.
 * - Falls back gracefully if optional plugins can't be loaded.
 */
export default defineConfig(async ({ command, mode }) => {
  const plugins: Array<any> = [react()];

  // Only try to load Replit dev-only plugins during development on Replit (or when env indicates).
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    // runtime error overlay (may be ESM-only)
    try {
      const runtimeModal = await import("@replit/vite-plugin-runtime-error-modal");
      // plugin might export default or a function directly
      const runtimePlugin = runtimeModal.default ?? runtimeModal;
      plugins.push(typeof runtimePlugin === "function" ? runtimePlugin() : runtimePlugin);
    } catch (err) {
      // Not fatal — warn and continue (important when building locally or in CI).
      // eslint-disable-next-line no-console
      console.warn("Could not load @replit/vite-plugin-runtime-error-modal:", (err as Error).message);
    }

    // cartographer plugin (may be ESM-only and uses top-level await in some configs)
    try {
      const cartoMod = await import("@replit/vite-plugin-cartographer");
      const cartographer = (cartoMod as any).cartographer ?? cartoMod.default?.cartographer ?? cartoMod.default;
      if (typeof cartographer === "function") {
        plugins.push(cartographer());
      }
    } catch (err) {
      // Not fatal — warn and continue
      // eslint-disable-next-line no-console
      console.warn("Could not load @replit/vite-plugin-cartographer:", (err as Error).message);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets"),
      },
    },
    root: path.resolve(process.cwd(), "client"),
    build: {
      outDir: path.resolve(process.cwd(), "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
