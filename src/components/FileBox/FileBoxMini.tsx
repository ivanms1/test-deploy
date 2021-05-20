import React from "react";
import { Link } from "react-router-dom";

import Thumbnail from "../Thumbnail";

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
      <div className={styles.FileImageBox}>
        <Thumbnail imgSrc={data} className={styles.FileImage} />
      </div>
      <p className={styles.FileName}>{file.name}</p>
    </Link>
  );
}

export default FileBoxMini;
