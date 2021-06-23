import React from "react";

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
    <div className={styles.FileBoxMini}>
      <div className={styles.FileImageBox}>
        <Thumbnail
          imgSrc={data}
          className={styles.FileImage}
          link={`file/${file?.id}`}
          fileForList={file}
        />
      </div>
      <p className={styles.FileName}>{file.name}</p>
    </div>
  );
}

export default FileBoxMini;
