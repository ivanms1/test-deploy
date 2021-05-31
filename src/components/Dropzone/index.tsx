import React from "react";
import classNames from "classnames";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

import styles from "./Dropzone.module.scss";

interface DropzoneProps extends DropzoneOptions {
  currentFile?: any;
  onDrop: (file: any) => void;
  className?: string;
  label?: string;
  withPreview?: boolean;
  maxSize?: number;
  rejectMessage?: string;
}

const defaultReject = "File upload failed: File is too large";

function Dropzone({
  onDrop,
  className,
  label = "Drop your file ",
  currentFile,
  withPreview,
  accept,
  maxSize = null,
  rejectMessage = defaultReject,
}: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    maxSize,
    onDropRejected: () => {
      toast.error(rejectMessage, {
        autoClose: 1500,
        position: "bottom-center",
      });
    },
  });

  return (
    <div
      className={classNames(styles.Container, className, {
        [styles.hasFile]: !!currentFile?.name,
      })}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {currentFile ? (
        withPreview ? (
          <img
            src={currentFile}
            className={styles.Preview}
            alt={currentFile?.name}
          />
        ) : (
          <span className={styles.Label}>{currentFile?.name}</span>
        )
      ) : (
        <span className={styles.Label}>{label}</span>
      )}
    </div>
  );
}

export default Dropzone;
