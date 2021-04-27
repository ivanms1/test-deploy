import React from "react";
import { Link } from "react-router-dom";

import useGetImage from "../../hooks/useGetImage";

import { FileProps } from "../../types";

import styles from "./FileBoxMini.module.scss";

export interface FileBoxMiniProps {
  file: FileProps;
}

function FileBoxMini({ file }: FileBoxMiniProps) {
  const { data } = useGetImage(file?.info?.thumbnail);

  return (
    <Link className={styles.FileBoxMini} to={`file/${file?.id}`}>
      {data ? (
        <img className={styles.FileImage} src={data} alt={file.name} />
      ) : (
        <div className={styles.NoImage}>No peers available</div>
      )}
      <p className={styles.FileName}>{file.name}</p>
    </Link>
  );
}

export default FileBoxMini;
