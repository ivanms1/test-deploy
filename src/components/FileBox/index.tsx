import React from "react";
import { Link } from "react-router-dom";

import Thumbnail from "../Thumbnail";
import LikeButton from "../LikeButton";

import useGetImage from "../../hooks/useGetImage";

import isHot from "../../helpers/isHot";

import DownloadIcon from "../../assets/icons/download.svg";
import Flame from "../../assets/icons/flame.svg";

import { FileProps } from "../../types";

import styles from "./FileBox.module.scss";

export interface FileBoxProps {
  file: FileProps;
}

function FileBox({ file }: FileBoxProps) {
  const { data } = useGetImage(file?.info?.thumbnail);

  return (
    <div className={styles.FileBox}>
      <div className={styles.ImageContainer}>
        <Thumbnail
          imgSrc={data}
          className={styles.FileImage}
          link={`/file/${file?.id}`}
          fileForList={file}
        />
      </div>
      <div className={styles.InfoSection}>
        <div className={styles.Top}>
          <LikeButton file={file} />
          <p className={styles.Downloads}>
            {isHot(file?.content_stats?.rate ?? 0) && (
              <Flame className={styles.Flame} />
            )}
            <DownloadIcon className={styles.DownloadIcon} />
            {file?.content_stats?.downloads_cnt}
          </p>
        </div>
        <Link to={`file/${file?.id}`} className={styles.Link}>
          <p className={styles.FileName}>{file.name}</p>
        </Link>
      </div>
    </div>
  );
}

export default FileBox;
