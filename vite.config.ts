
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


export default defineConfig(async ({ command, mode }) => {
  const plugins: Array<any> = [react()];


  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {

    try {
      const runtimeModal = await import("@replit/vite-plugin-runtime-error-modal");
    
      const runtimePlugin = runtimeModal.default ?? runtimeModal;
      plugins.push(typeof runtimePlugin === "function" ? runtimePlugin() : runtimePlugin);
    } catch (err) {
  
      console.warn("Could not load @replit/vite-plugin-runtime-error-modal:", (err as Error).message);
    }

    try {
      const cartoMod = await import("@replit/vite-plugin-cartographer");
      const cartographer = (cartoMod as any).cartographer ?? cartoMod.default?.cartographer ?? cartoMod.default;
      if (typeof cartographer === "function") {
        plugins.push(cartographer());
      }
    } catch (err) {
 
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
