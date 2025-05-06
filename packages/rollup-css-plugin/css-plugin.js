// https://github.com/JetBrains/ring-ui/tree/master/packages/rollup-css-plugin
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");

const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssUrl = require("postcss-url");
const cssModules = require("postcss-modules");
const cssNano = require("cssnano");
const loadPostcssConfig = require("postcss-load-config");
const FileSystemLoader = require("postcss-modules/build/FileSystemLoader").default;

const {createFilter} = require("@rollup/pluginutils");

const {DependencyManager} = require("./dependency-manager");

function generateHash(input) {
  const HASH_LENGTH = 5;
  return crypto.createHash("sha256")
    .update(input)
    .digest("hex")
    .substring(0, HASH_LENGTH);
}

function deduplicatePaths(paths) {
  return [...new Set(paths)];
}

module.exports = function cssPlugin(options = {}) {
  const pluginOptions = {
    include: options.include || "**/*.css",
    exclude: options.exclude || "node_modules/**",
    outputFile: options.outputFile || "style.css",
    minimize: !!options.minimize,
    debug: !!options.debug,
    classNamePattern: options.classNamePattern || "[name]_flow_[hash]",
    logger: options.logger || options.log || (() => {
    }),
  };

  const fileFilter = createFilter(pluginOptions.include, pluginOptions.exclude);

  const depManager = new DependencyManager();
  const processedFiles = new Map();
  const cssModulesCache = new Map();
  const sourceFiles = new Set();

  const postcssConfigPromise = loadPostcssConfig();

  const log = (message, ...args) => {
    if (pluginOptions.debug) {
      pluginOptions.logger(`[css-plugin] ${message}`, ...args);
    }
  };

  async function processFile(filePath) {
    if (processedFiles.has(filePath)) {
      return processedFiles.get(filePath);
    }

    try {
      const postcssConfig = await postcssConfigPromise;

      const fileContent = await fs.readFile(filePath, "utf-8");

      const plugins = await buildPluginChain(filePath, postcssConfig);

      const result = await postcss(plugins).process(fileContent, {
        from: filePath,
        to: filePath,
        map: false,
      });

      processedFiles.set(filePath, result.css);
      log("Processed file", path.basename(filePath));

      return result.css;
    } catch (error) {
      log("Error processing file", filePath, error);
      throw new Error(`Failed to process CSS file ${filePath}: ${error.message}`);
    }
  }

  async function buildPluginChain(filePath, postcssConfig) {
    return [
      postcssImport({
        resolve: (importedFile, basedir) => {
          const resolvedPath = path.resolve(basedir, importedFile);
          log("Resolving import", importedFile, "from", basedir, "to", resolvedPath);

          depManager.addDependency(filePath, resolvedPath);
          return resolvedPath;
        },
        load: async (filename) => {
          await processFile(filename);
          return `/* Import from "${path.basename(filename)}" processed */\n`;
        },
      }),

      ...(postcssConfig.plugins || []),

      postcssUrl({
        includeUriFragment: true,
        url: "inline",
      }),

      cssModules({
        generateScopedName: (name, filename) => {
          const hash = generateHash(filename);
          return pluginOptions.classNamePattern
            .replace("[name]", name)
            .replace("[hash]", hash);
        },
        getJSON: (filepath, json) => {
          cssModulesCache.set(filepath, json);
        },
        Loader: class CustomLoader extends FileSystemLoader {
          async fetch(file, relativeTo, _trace) {
            const result = await super.fetch(file, relativeTo, _trace);

            const normalizedFile = file.replace(/^["']|["']$/g, "");
            const resolvedPath = path.resolve(path.dirname(relativeTo), normalizedFile);

            await processFile(resolvedPath);

            depManager.addDependency(filePath, resolvedPath);

            this.sources[resolvedPath] = `/* Values from "${path.basename(resolvedPath)}" imported */\n`;

            return result;
          }
        },
        resolve: async (file, importer) => {
          const resolvedPath = path.resolve(path.dirname(importer), file);
          log("Resolving module reference", file, "from", importer, "to", resolvedPath);

          await processFile(resolvedPath);
          depManager.addDependency(filePath, resolvedPath);

          return resolvedPath;
        },
      }),
    ];
  }

  return {
    name: "css",

    async transform(code, id) {
      if (!fileFilter(id)) {
        return null;
      }

      sourceFiles.add(id);

      await processFile(id);

      return {
        code: `export default ${JSON.stringify(cssModulesCache.get(id) || {})};`,
        map: null,
        moduleSideEffects: "no-treeshake",
      };
    },

    async generateBundle() {
      try {
        const orderedFiles = deduplicatePaths([
          ...depManager.getOrderedFiles(),
          ...sourceFiles,
        ]);

        const cssContents = orderedFiles
          .map(filePath => {
            if (!processedFiles.has(filePath)) {
              log("Warning: Missing processed content for", filePath);
              return "";
            }

            return `/* ${path.basename(filePath)} */\n${processedFiles.get(filePath)}`;
          })
          .filter(Boolean)
          .join("\n\n");

        let finalCss = cssContents;

        if (pluginOptions.minimize) {
          log("Minimizing CSS output...");
          const result = await postcss([cssNano()]).process(cssContents, {
            from: pluginOptions.outputFile,
            to: pluginOptions.outputFile,
            map: false,
          });
          finalCss = result.css;
          log("CSS minimized successfully");
        }

        this.emitFile({
          type: "asset",
          fileName: pluginOptions.outputFile,
          source: finalCss,
        });

        log(`CSS bundle generated: ${pluginOptions.outputFile} (${finalCss.length} bytes)`);
      } catch (error) {
        log("Error generating CSS bundle", error);
        throw new Error(`Failed to generate CSS bundle: ${error.message}`);
      }
    },
  };
};
