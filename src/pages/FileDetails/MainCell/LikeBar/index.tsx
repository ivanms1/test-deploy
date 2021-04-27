import React, { useState } from "react";

import Button from "../../../../components/Button";
import Tooltip from "../../../../components/Tooltip";

import useLikeContent from "../../../../hooks/useLikeContent";
import useCurrentUser from "../../../../hooks/useCurrentUser";

import HeartFull from "../../../../assets/icons/heart-full.svg";
import HeartEmpty from "../../../../assets/icons/heart-empty.svg";
import styles from "./LikeBar.module.scss";
import { FileProps } from "../../../../types";

interface LikeProps {
  file: FileProps;
}

function LikeControls({ file }: LikeProps) {
  const [localLikeStatus, setLocalLikeStatus] = useState(file?.is_liked);
  const [localLikeCount, setLocalLikeCount] = useState(
    file?.content_stats.likes_cnt || 0
  );

  const { currentUser } = useCurrentUser();
  const { likeContent } = useLikeContent();

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
      <span className={styles.LikeNumber}>{localLikeCount}</span>
    </div>
  );
}

function LikeBar({ file }: LikeProps) {
  return (
    <div className={styles.LikeBar}>
      <div className={styles.Uploaded}>
        {file?.content_stats.downloads_cnt} Total Downloads
      </div>
      <LikeControls file={file} />
    </div>
  );
}
export default LikeBar;
