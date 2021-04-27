import React from "react";

import styles from "./ProfileText.module.scss";
import CopyIcon from "../../../assets/icons/copy.svg";

export default function ProfileText({
  authorID,
  walletHash,
}: {
  authorID: string;
  walletHash: string;
}) {
  return (
    <div className={styles.ProfileText}>
      <div className={styles.IDPart}>
        <div className={styles.Label}>ID</div>
        <div className={styles.Hash}>{walletHash}</div>
        <div className={styles.CopyBtn}>
          <CopyIcon className={styles.CopyIcon} />
        </div>
      </div>
      {/* About Me text will go here when implemented */}
      <div className={styles.About}></div>
    </div>
  );
}
