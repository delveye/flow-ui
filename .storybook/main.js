module.exports = {
  stories: ["../src/welcome.stories.tsx", "../src/**/*.stories.{js,ts,tsx}"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-themes"],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-vite",
  },
  docs: {
    autodocs: true,
  },
};
