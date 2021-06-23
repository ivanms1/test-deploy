import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Button from "../../../../Button";

import useDownloadFile from "../../../../../hooks/useDownloadFile";
import { useAppContext } from "../../../../AppContext";

import { FileProps } from "../../../../../types";

import DownloadIcon from "../../../../../assets/icons/download.svg";
import CloseIcon from "../../../../../assets/icons/close.svg";

import styles from "./ListItem.module.scss";
import classNames from "classnames";

type Download = {
  name: string;
  id: number;
  handleDelete: () => void;
};

interface Props {
  file: FileProps;
  handleDelete: () => void;
}

function ListItem({ file, handleDelete }: Props) {
  const { isManagerConnected } = useAppContext();
  const { downloadFile } = useDownloadFile();

  const handleDownload = async () => {
    const data: any = await downloadFile({
      hash: file?.info?.content_hash,
      name: file?.info.file_name,
      publicHash: file?.info?.public_hash,
      contentId: file?.id,
      size: file?.info?.size,
      title: file?.name,
    });

    if (data?.success) {
      toast.info("Your download has started", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } else {
      toast.error(data?.error ?? "An error ocurred", {
        position: "bottom-center",
      });
    }
  };

  return (
    <motion.div
      className={styles.ListItemContainer}
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      transition={{ ease: "easeIn" }}
    >
      <div className={styles.ListItem}>
        <div className={styles.Item}>
          <Link to={`/file/${file.id}`}>
            <Button className={styles.ItemButton} noStyle>
              <p className={styles.Title}>{file.name}</p>
            </Button>
          </Link>
          {isManagerConnected ? (
            <Button
              type="button"
              noStyle
              className={styles.DownloadButton}
              onClick={() => {
                handleDownload();
                handleDelete();
              }}
            >
              <DownloadIcon className={styles.DownloadIcon} />
            </Button>
          ) : (
            <Button
              noStyle
              className={styles.DownloadButton}
              type="button"
              onClick={() =>
                toast.warning("Connect to Conun manager in order to download", {
                  autoClose: 1500,
                  position: "bottom-center",
                })
              }
            >
              <DownloadIcon
                className={classNames(styles.DownloadIcon, styles.noManager)}
              />
            </Button>
          )}
        </div>
      </div>

      <Button className={styles.DeleteButton} noStyle onClick={handleDelete}>
        <CloseIcon className={styles.DeleteIcon} />
      </Button>
    </motion.div>
  );
}

export default ListItem;
