import React from "react";
import ReactMarkdown from "react-markdown";
import README from "../README.md";

export default {
  title: "Flow UI",
};

export const gettingStarted = () => {
  return <ReactMarkdown children={README} />;
};

gettingStarted.parameters = {
  actions: {disable: true},
  controls: {disable: true},
};
