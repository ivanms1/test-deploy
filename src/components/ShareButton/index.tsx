import React from "react";
import { toast } from "react-toastify";

import Button from "../Button";

import ShareIcon from "../../assets/icons/share.svg";

import styles from "./ShareButton.module.scss";

function ShareButton({ fileID }: { fileID: string | number }) {
  const handleGetLink = () => {
    toast.info("Link copied to clipboard!", {
      autoClose: 1500,
      position: "bottom-center",
    });
    navigator.clipboard.writeText(`conun-drive://${fileID}`);
  };

  return (
    <Button
      className={styles.ShareButton}
      noStyle
      onClick={() => handleGetLink()}
    >
      <ShareIcon className={styles.Icon} />
    </Button>
  );
}

export default ShareButton;
