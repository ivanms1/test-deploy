import React from "react";

import Button from "../../../components/Button";

import CopyIcon from "../../../assets/icons/copy.svg";

import styles from "./ProfileText.module.scss";

export default function ProfileText({
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
        <Button
          className={styles.CopyBtn}
          noStyle
          onClick={() => {
            navigator.clipboard.writeText(walletHash);
          }}
        >
          <CopyIcon className={styles.CopyIcon} />
        </Button>
      </div>
      {/* About Me text will go here when implemented */}
      <div className={styles.About}></div>
    </div>
  );
}
