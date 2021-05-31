import React from "react";
import Thumbnail from "../../../components/Thumbnail";
import LikeButton from "../../../components/LikeButton";

import useGetImage from "../../../hooks/useGetImage";

import trunc from "../../../helpers/trunc";

import { FileProps } from "../../../types";

import DownloadIcon from "../../../assets/icons/download.svg";

import styles from "./Cell.module.scss";

const { api } = window;

interface CellProps {
  file: FileProps;
}

function Controls({ file }: CellProps) {
  return (
    <div className={styles.Controls}>
      <div className={styles.ControlGrid}>
        <LikeButton file={file} />
        <div className={styles.Downloads}>
          <div className={styles.DLBtn}>
            <DownloadIcon className={styles.Icon} />
          </div>
          <div className={styles.Count}>
            {file.content_stats.downloads_cnt.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ file }: CellProps) {
  const { data: thumbImgSrc } = useGetImage(file.info.thumbnail);

  return (
    <div className={styles.Cell}>
      <Thumbnail
        imgSrc={thumbImgSrc}
        className={styles.Thumb}
        link={`/file/${file.id}`}
        fileForList={file}
      />
      <div className={styles.Text}>
        <span className={styles.Title}>{trunc(file.name, 100)}</span>
        <span className={styles.Date}>
          {new Date(file.info.created_at).toLocaleDateString()}
        </span>
      </div>
      <Controls file={file} />
    </div>
  );
}

export default Cell;
