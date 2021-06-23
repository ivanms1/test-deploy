import React from "react";

import { motion } from "framer-motion";

import Button from "../../../../Button";
import CheckmarkIcon from "../../../../../assets/icons/checkmark.svg";
import CloseIcon from "../../../../../assets/icons/close.svg";

import styles from "./DownloadItem.module.scss";

const { api } = window;

type Download = {
  id: string;
  name: string;
  status: "IN_PROGRESS" | "FINISHED" | "CANCELLED";
  fileName: string;
  percentage: number;
  path: string;
};

interface DownloadItemProps {
  download: Download;
  removeItem: (id: string) => void;
}

function DownloadIcon({ download }: { download: Download }) {
  if (download.status === "FINISHED") {
    return <CheckmarkIcon className={styles.CheckmarkIcon} />;
  }
  if (download.status === "CANCELLED") {
    return <CheckmarkIcon className={styles.CancelledIcon} />;
  }
  return (
    <span>
      {download.percentage && `${download?.percentage?.toFixed() ?? 0}%`}
    </span>
  );
}

function ProgressBar({ download }: { download: Download }) {
  return (
    <div className={styles.ProgressBar}>
      <span
        className={styles.Progress}
        style={{ width: `${download?.percentage || "0"}%` }}
      ></span>
    </div>
  );
}

function DownloadItem({ download, removeItem }: DownloadItemProps) {
  const openFile = async () => {
    if (download?.path) {
      await api.openFile(download?.path);
    }
  };

  return (
    <motion.div
      className={styles.DownloadItemContainer}
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      transition={{ ease: "easeIn" }}
    >
      <div className={styles.DownloadItem}>
        <Button className={styles.Download} onClick={openFile} noStyle>
          <p className={styles.Title}>{download.name}</p>
          <DownloadIcon download={download} />
        </Button>
        <ProgressBar download={download} />
      </div>

      <Button
        className={styles.DeleteButton}
        onClick={() => removeItem(download.id)}
        disabled={download.status !== "FINISHED"}
        noStyle
      >
        <CloseIcon className={styles.DeleteIcon} />
      </Button>
    </motion.div>
  );
}

export default DownloadItem;
