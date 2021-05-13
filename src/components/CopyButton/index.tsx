import React from "react";
import Button from "../Button";

import CopyIcon from "../../assets/icons/copy.svg";

import styles from "./CopyButton.module.scss";

function CopyButton({ walletAdd }: { walletAdd: string }) {
  return (
    <div className={styles.CopyBtn}>
      <Button
        noStyle
        onClick={() => {
          navigator.clipboard.writeText(walletAdd);
        }}
      >
        <CopyIcon className={styles.CopyIcon} />
      </Button>
    </div>
  );
}

export default CopyButton;
