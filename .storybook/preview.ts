import type {Preview} from "@storybook/react";
import "./root.css";

const preview: Preview = {
  parameters: {
    controls: {
      disable: true,
      expanded: true,
    },
  },
};

export default preview;
