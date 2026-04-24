import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/index.ts", "src/types/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["@anthropic-ai/sdk"],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve("src"),
    };
  },
});
