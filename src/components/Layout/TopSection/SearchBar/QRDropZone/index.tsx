import React from "react";

import { DropzoneOptions, useDropzone } from "react-dropzone";

import QRIcon from "../../../../../assets/icons/qrcode.svg";

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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    maxSize,
    noClick,
  });

  return (
    <div className={styles.Container} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className={styles.Form}>
          <QRIcon className={styles.QRIcon} />
          <div className={styles.DropHere}>Drop your QR code file here</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default QRDropZone;

// children
