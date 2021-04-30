import React from "react";

import fileSizeToReadable from "../../../../helpers/fileSizeToReadable";

import styles from "./FileProperties.module.scss";

type FilePropProps = {
  fileExt: string;
  fileSize: number;
  created: string;
};

function FileProperties({ fileExt, fileSize, created }: FilePropProps) {
  return (
    <div className={styles.FileProperties}>
      <p className={styles.Property}>
        File Type: <span>{fileExt}</span>
      </p>
      <p className={styles.Property}>
        File Size: <span>{fileSizeToReadable(fileSize)}</span>
      </p>
      <p className={styles.Property}>
        Uploaded: <span>{new Date(created).toLocaleString()}</span>
      </p>
    </div>
  );
}

export default FileProperties;
