import React from "react";
import MarkdownIt from "markdown-it";

import ReadMe from "../README.md";

import License from "raw-loader!../LICENSE.txt";

const markdownIt = new MarkdownIt("commonmark", {
  html: false,
}).enable("table");

export default {
  title: "Flow UI",
};

export const gettingStarted = () => {
  const renderedMarkdown = markdownIt.render(ReadMe);
  return <div dangerouslySetInnerHTML={{__html: renderedMarkdown}} />;
};

export const license = () => <pre>{License}</pre>;
