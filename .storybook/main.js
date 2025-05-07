export default {
  stories: ["../src/welcome.stories.tsx", "../src/**/*.stories.{js,ts,tsx}"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-themes"],
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-vite",
  },
  docs: {
    autodocs: true,
  },
  staticDirs: ["./public", "./"],
  viteFinal: async config => {
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: "markdown-loader",
      transform(code, id) {
        if (id.slice(-3) === ".md") {
          return `export default ${JSON.stringify(code)};`;
        }
      },
    });
    return config;
  },
};
