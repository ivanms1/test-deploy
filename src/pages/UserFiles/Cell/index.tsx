import React, { useState } from "react";

import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";

import useCurrentUser from "../../../hooks/useCurrentUser";
import useGetImage from "../../../hooks/useGetImage";
import useLikeContent from "../../../hooks/useLikeContent";

import trunc from "../../../helpers/trunc";

import { FileProps } from "../../../types";

import DownloadIcon from "../../../assets/icons/download.svg";
import HeartEmpty from "../../../assets/icons/heart-empty.svg";
import HeartFull from "../../../assets/icons/heart-full.svg";

import styles from "./Cell.module.scss";
import { Link } from "react-router-dom";

interface CellProps {
  file: FileProps;
}

function Controls({ file }: CellProps) {
  const { currentUser } = useCurrentUser();
  const { likeContent } = useLikeContent();

  const [localLikeStatus, setLocalLikeStatus] = useState(file?.is_liked);
  const [localLikeCount, setLocalLikeCount] = useState(
    file?.content_stats.likes_cnt || 0
  );

  const handleLike = async () => {
    await likeContent({
      userId: currentUser?.id,
      contentId: file?.id,
      publicHash: file?.info?.public_hash,
    });

    setLocalLikeStatus(true);
    setLocalLikeCount((prev) => prev + 1);
  };

  return (
    <div className={styles.Controls}>
      <div className={styles.ControlGrid}>
        <div className={styles.Count}>{localLikeCount.toLocaleString()}</div>
        <div className={styles.LikeBtn}>
          {localLikeStatus ? (
            <HeartFull className={styles.Icon} />
          ) : (
            <Tooltip id="like">
              <Button
                noStyle
                type="button"
                onClick={handleLike}
                data-for="like"
                data-tip="Liking is permanent."
              >
                <HeartEmpty className={styles.Icon} />
              </Button>
            </Tooltip>
          )}
        </div>

        <div className={styles.Count}>
          {file.content_stats.downloads_cnt.toLocaleString()}
        </div>
        <div className={styles.DLBtn}>
          <DownloadIcon className={styles.Icon} />
        </div>
      </div>
    </div>
  );
}

function Cell({ file }: CellProps) {
  const { data: thumbImgSrc } = useGetImage(file.info.thumbnail);

  return (
    <div className={styles.Cell}>
      <Link to={`/file/${file.id}`}>
        <img className={styles.Thumb} src={thumbImgSrc} />
      </Link>
      <div className={styles.Text}>
        <span className={styles.Title}>{trunc(file.name, 100)}</span>
        <span className={styles.Date}>
          {new Date(file.info.created_at).toLocaleDateString()}
        </span>
      </div>
      <Controls file={file} />
    </div>
  );
}

export default Cell;
