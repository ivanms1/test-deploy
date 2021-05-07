import React from "react";
import classNames from "classnames";

import styles from "./SmallSpinner.module.scss";

interface SpinnerProps {
  className?: any;
}

function SmallSpinner({ className }: SpinnerProps) {
  return <div className={classNames(styles.Spinner, className)} />;
}

export default SmallSpinner;
