import {addons} from "@storybook/manager-api";
import {create} from "@storybook/theming";

const flowUITheme = create({
  base: "light",
  brandTitle: "Flow UI - Delveye Web UI Library",
  brandUrl: "https://github.com/delveye/flow-ui",
  brandTarget: "_blank",
});

addons.setConfig({
  enableShortcuts: false,
  theme: flowUITheme,
  showPanel: false,
  showToolbar: false,
  previewTabs: {
    canvas: {hidden: true},
  },
  sidebar: {
    showRoots: true,
  },
});
