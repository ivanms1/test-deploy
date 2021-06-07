import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

import styles from "./QRDropZone.module.scss";

interface DropzoneProps extends DropzoneOptions {
  onDrop: (file: any) => void;
  children: React.ReactNode;
}

function QRDropZone({
  onDrop,
  accept,
  maxSize = null,
  children,
  noClick = false,
}: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    maxSize,
    noClick,
  });

  return (
    <div className={styles.Container} {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

export default QRDropZone;
