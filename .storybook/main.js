const path = require("path");

const flowConfig = require("../webpack.config").createConfig();

module.exports = {
  stories: ["../src/welcome.stories.tsx", "../src/**/*.stories.{js,ts,tsx}"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-themes"],
  webpackFinal(config) {
    flowConfig.componentsPath.push(
      __dirname,
      path.resolve(__dirname, "../src")
    );

    config.module.rules = [
      ...flowConfig.config.module.rules,
      config.module.rules.find(rule =>
        /react-docgen-loader\.js$/.test(rule.loader)
      ),
      {
        test: /\.md$/,
        loader: "raw-loader",
      },
      {
        test: /\.png$/,
        type: "asset/resource",
      },
      {test: /\.m?js$/, resolve: {fullySpecified: false}},
    ];

    return config;
  },
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  // staticDirs: ['./custom-header/dist'],
  typescript: {
    reactDocgen: "react-docgen",
  },
};
