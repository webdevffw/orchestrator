import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { glob } from "glob";
import pkg from "./package.json" assert { type: "json" };

// Dynamically discover all TypeScript files
const inputEntries = Object.fromEntries(
  glob.sync("src/**/*.ts").map(file => [
    file.replace(/^src\//, "").replace(/\.ts$/, ""),
    file
  ])
);

// Bundle build for CDN/script tag usage
export const bundleBuild = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto"
    }
  ],
  plugins: [
    nodeResolve({ 
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
}

// Flat structure build with index at root
export const flatBuild = {
  input: inputEntries,
  output: [
    {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
      // This creates a flat structure in dist/
      entryFileNames: ({ name }) => {
        // Keep index.js at root, others in their relative paths
        if (name === 'index') return 'index.js';
        return `${name}.js`;
      }
    },
    {
      dir: "dist",
      format: "cjs",
      sourcemap: true,
      exports: "named", 
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: ({ name }) => {
        if (name === 'index') return 'index.cjs';
        return `${name}.cjs`;
      }
    }
  ],
  plugins: [
    nodeResolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
}

export default [flatBuild, bundleBuild];
