import React from "react";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
import LikeBar from "./LikeBar";
import FileProperties from "./FileProperties";
import Tooltip from "../../../components/Tooltip";
import Thumbnail from "../../../components/Thumbnail";

import useGetImage from "../../../hooks/useGetImage";
import useDownloadFile from "../../../hooks/useDownloadFile";
import { useAppContext } from "../../../components/AppContext";

import trunc from "../../../helpers/trunc";

import { FileProps } from "../../../types";

import styles from "./MainCell.module.scss";

interface MainCellProps {
  file: FileProps;
}

function MainCell({ file }: MainCellProps) {
  const { isManagerConnected } = useAppContext();
  const { downloadFile, isLoading } = useDownloadFile();
  const { data: thumbImgSrc } = useGetImage(file?.info?.thumbnail);

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
    <div className={styles.Cell}>
      <div className={styles.Image}>
        <Thumbnail
          imgSrc={thumbImgSrc}
          className={styles.MainImage}
          fileForList={file}
        />
      </div>
      <LikeBar file={file} />
      <div className={styles.ItemTitle}>{file && trunc(file.name, 55)}</div>
      <FileProperties
        fileExt={file?.info.ext}
        fileSize={file?.info.size}
        created={file?.info.created_at}
      />
      <div className={styles.PurchaseControls}>
        {isManagerConnected ? (
          <Button
            className={styles.PurchaseButton}
            type="button"
            loading={isLoading}
            disabled={!thumbImgSrc || isLoading}
            onClick={handleDownload}
          >
            Download
          </Button>
        ) : (
          <Tooltip id="download-button">
            <Button
              className={styles.PurchaseButton}
              type="button"
              data-for="download-button"
              data-tip="Connect to Conun manager in order to download"
            >
              Download
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default MainCell;
