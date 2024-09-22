import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

/**
 * @param {string} file
 */
const compileEntrypoint = (file) =>
  defineConfig({
    input: file,
    output: { file: file.replace("src", "dist").replace("ts", "js") },
    plugins: [esbuild()],
  });

export default [
  compileEntrypoint("./src/options.ts"),
  compileEntrypoint("./src/sw.ts"),
  compileEntrypoint("./src/script.ts"),
];
