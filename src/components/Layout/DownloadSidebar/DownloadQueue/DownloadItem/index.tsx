import React from "react";
import { saveAs } from "file-saver";

import Button from "../../../../Button";

import CheckmarkIcon from "../../../../../assets/icons/checkmark.svg";

import styles from "./DownloadItem.module.scss";

const { api } = window;

interface DownloadItemProps {
  download: {
    id: string;
    name: string;
    status: "IN_PROGRESS" | "FINISHED" | "CANCELLED";
    fileName: string;
    percentage: number;
    path: string;
  };
}

function DownloadIcon({ download }: DownloadItemProps) {
  if (download.status === "FINISHED") {
    return <CheckmarkIcon className={styles.CheckmarkIcon} />;
  }
  if (download.status === "CANCELLED") {
    return <CheckmarkIcon className={styles.CancelledIcon} />;
  }
  return null;
}

function ProgressBar({ download }: DownloadItemProps) {
  return (
    <div className={styles.ProgressBar}>
      <span
        className={styles.Progress}
        style={{ width: `${download.percentage}%` }}
      ></span>
    </div>
  );
}

function DownloadItem({ download }: DownloadItemProps) {
  const openFile = async () => {
    if (download?.path) {
      await api.openFile(download?.path);
    }
  };

  return (
    <>
      <Button className={styles.Download} onClick={openFile} noStyle>
        <p className={styles.Title}>{download.name}</p>
        <DownloadIcon download={download} />
      </Button>
      <ProgressBar download={download} />
    </>
  );
}

export default DownloadItem;
