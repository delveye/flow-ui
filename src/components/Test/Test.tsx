import React from "react";
import cx from "classnames";

import styles from "./Test.css";

export interface TestProps {
  text?: string;
}

const Test = ({text = "Default text"}: TestProps) => {
  return (
    <div>
      <h1 className={cx(styles.test)}>Test</h1>
      <p>{text}</p>
    </div>
  );
};

export default Test;
