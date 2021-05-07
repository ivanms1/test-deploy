import React from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

import SmallSpinner from "../Spinner/SmallSpinner";

import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ref?: any;
  round?: boolean;
  loading?: boolean;
  noStyle?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "grey";
}

function Button({
  children,
  className,
  noStyle,
  round,
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  if (noStyle) {
    return (
      <motion.button
        whileTap={{ y: "1px" }}
        className={classNames(styles.NoStyleButton, className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ y: "1px" }}
      className={classNames(styles.Button, className, styles[variant], {
        [styles.round]: round,
      })}
      {...props}
    >
      {loading ? <SmallSpinner className={styles.Spinner} /> : children}
    </motion.button>
  );
}

export default Button;
