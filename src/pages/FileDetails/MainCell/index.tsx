import React from "react";
import { saveAs } from "file-saver";

import Button from "../../../components/Button";
import LikeBar from "./LikeBar";
import FileProperties from "./FileProperties";
import Tooltip from "../../../components/Tooltip";

import useGetImage from "../../../hooks/useGetImage";
import useCurrentUser from "../../../hooks/useCurrentUser";
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
  const { currentUser } = useCurrentUser();
  const { downloadFile, isLoading } = useDownloadFile();
  const { data: thumbImgSrc } = useGetImage(file?.info?.thumbnail);

  return (
    <div className={styles.Cell}>
      {thumbImgSrc ? (
        <img className={styles.MainImage} src={thumbImgSrc} />
      ) : (
        <div className={styles.NoImage}>No peers available</div>
      )}
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
            onClick={async () => {
              const data: any = await downloadFile({
                hash: file?.info?.content_hash,
                publicHash: file?.info?.public_hash,
                userId: currentUser?.id,
                contentId: file?.id,
              });
              const newFile = new Blob(data.file);
              saveAs(newFile, file?.info.file_name);
            }}
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
