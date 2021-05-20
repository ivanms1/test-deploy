import React from "react";
import classNames from "classnames";

import styles from "./SmallSpinner.module.scss";

interface SpinnerProps {
  className?: any;
  inverted?: boolean;
}

function SmallSpinner({ className, inverted }: SpinnerProps) {
  return (
    <div
      className={classNames(styles.Spinner, className, {
        [styles.inverted]: inverted,
      })}
    />
  );
}

export default SmallSpinner;
