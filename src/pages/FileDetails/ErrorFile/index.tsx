import React from "react";

import styles from "./ErrorFile.module.scss";

const NO_USER = "NO_USER";
const NO_BAD_FILE = "NO_BAD_FILE";

function ErrorFile({
  reason,
}: {
  reason: typeof NO_USER | typeof NO_BAD_FILE;
}) {
  return (
    <div className={styles.Background}>
      {reason === NO_USER
        ? "Sorry, it looks like you're not logged in!"
        : "Sorry, we can't find that file."}
    </div>
  );
}
export default ErrorFile;
