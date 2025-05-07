import type {Preview} from "@storybook/react";
import "./public/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      disable: true,
      expanded: true,
    },
    viewMode: "docs",
  },
};

export default preview;
