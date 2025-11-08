import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,   // CommonJS build
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: pkg.module, // ESM build
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ extensions: [".ts", ".js"] }), // resolves node_modules
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true, // ensures .d.ts go to declarationDir
      clean: true,
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
