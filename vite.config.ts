import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: Number(process.env.PORT) || 8080,
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cached forever after first visit
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Heavy UI libs
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip", "@radix-ui/react-popover", "@radix-ui/react-select", "lucide-react"],
          // Data / state
          "vendor-data": ["@tanstack/react-query", "zustand", "immer"],
          // Supabase
          "vendor-supabase": ["@supabase/supabase-js"],
          // Firebase auth
          "vendor-firebase": ["firebase"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
