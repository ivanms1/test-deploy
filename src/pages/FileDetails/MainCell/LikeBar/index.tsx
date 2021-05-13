import React from "react";

import isHot from "../../../../helpers/isHot";

import Hot from "../../../../assets/icons/flame.svg";

import { FileProps } from "../../../../types";

import styles from "./LikeBar.module.scss";
import LikeButton from "../../../../components/LikeButton";

interface LikeProps {
  file: FileProps;
}

function LikeControls({ file }: LikeProps) {
  return (
    <div className={styles.Controls}>
      {isHot(file?.content_stats.rate) && <Hot className={styles.Icon} />}
      <LikeButton file={file} />
    </div>
  );
}

function LikeBar({ file }: LikeProps) {
  return (
    <div className={styles.LikeBar}>
      <div className={styles.Uploaded}>
        {file?.content_stats.downloads_cnt} Total Downloads
      </div>
      <LikeControls file={file} />
    </div>
  );
}
export default LikeBar;
