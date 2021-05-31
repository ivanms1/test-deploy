import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../Button";

import useDownloadFile from "../../../../../hooks/useDownloadFile";

import { FileProps } from "../../../../../types";

import DownloadIcon from "../../../../../assets/icons/download.svg";
import CloseIcon from "../../../../../assets/icons/close.svg";

import styles from "./ListItem.module.scss";

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
    <div className={styles.ListItemContainer}>
      <div className={styles.ListItem}>
        <div className={styles.Item}>
          <Link to={`/file/${file.id}`}>
            <Button className={styles.ItemButton} noStyle>
              <p className={styles.Title}>{file.name}</p>
            </Button>
          </Link>
          <Button
            noStyle
            className={styles.DownloadButton}
            onClick={() => {
              handleDownload();
              handleDelete();
            }}
          >
            <DownloadIcon className={styles.DownloadIcon} />
          </Button>
        </div>
      </div>

      <Button className={styles.DeleteButton} noStyle onClick={handleDelete}>
        <CloseIcon className={styles.DeleteIcon} />
      </Button>
    </div>
  );
}

export default ListItem;
