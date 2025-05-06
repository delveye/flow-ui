import {babel} from "@rollup/plugin-babel";
import cssPlugin from "@delveye/rollup-css-plugin";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import clear from "rollup-plugin-clear";
import glob from "glob";

const files = glob.sync(["components/**/*.{js,jsx}"], {
  ignore: ["components/**/*.stories.js"],
});

const TARGET_DIR = "dist";

const extensions = [".js", ".jsx"];

export default {
  external: id => {
    const isInternal = id.startsWith(".") || id.startsWith("/");
    return !isInternal;
  },

  input: files,

  output: {
    dir: TARGET_DIR,
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "components",
    sourcemap: true,
    indent: false,
    strict: false,
    entryFileNames: "[name].js",
    chunkFileNames: "_helpers/[name].js",
    assetFileNames: "[name][extname]",
  },

  plugins: [
    clear({
      targets: [TARGET_DIR],
    }),

    json(),

    resolve({extensions}),

    babel({
      babelHelpers: "bundled",
      browserslistEnv: "dist",
      extensions,
    }),

    cssPlugin({
      include: "**/*.css",
      exclude: "node_modules/**",
      outputFile: "style.css",
      minimize: true,
      classNamePattern: "[name]_flow_[hash]",
      debug: true,
      logger: console.log,
    }),

    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
  ],
};
