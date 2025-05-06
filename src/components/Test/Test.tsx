import React from "react";

export interface TestProps {
  text?: string;
}

const Test = ({text = "Default text"}: TestProps) => {
  return (
    <div>
      <h1>Test</h1>
      <p>{text}</p>
    </div>
  );
};

export default Test;
