import React from "react";

import styles from "./FileProperties.module.scss";

type FilePropProps = {
  fileExt: string;
  fileSize: string | number;
  created: string;
};

function FileProperties({ fileExt, fileSize, created }: FilePropProps) {
  return (
    <div className={styles.FileProperties}>
      <span className={styles.Property}>File Type: {fileExt}</span>
      <span className={styles.Property}>File Size: {fileSize} kb</span>
      <span className={styles.Property}>
        Uploaded: {new Date(created).toLocaleString()}
      </span>
    </div>
  );
}

export default FileProperties;
