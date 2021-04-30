import React, { useState } from "react";

import Button from "../../../../components/Button";
import Tooltip from "../../../../components/Tooltip";

import useLikeContent from "../../../../hooks/useLikeContent";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import { useAppContext } from "../../../../components/AppContext";

import HeartFull from "../../../../assets/icons/heart-full.svg";
import HeartEmpty from "../../../../assets/icons/heart-empty.svg";

import { FileProps } from "../../../../types";

import styles from "./LikeBar.module.scss";

interface LikeProps {
  file: FileProps;
}

function LikeControls({ file }: LikeProps) {
  const [localLikeStatus, setLocalLikeStatus] = useState(file?.is_liked);
  const [localLikeCount, setLocalLikeCount] = useState(
    file?.content_stats.likes_cnt || 0
  );

  const { isManagerConnected } = useAppContext();

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
            onClick={isManagerConnected ? handleLike : null}
            data-for="like"
            data-tip={
              isManagerConnected
                ? "Liking is permanent."
                : "Connect to Conun manager to like this file"
            }
          >
            <HeartEmpty className={styles.Icon} />
          </Button>
        </Tooltip>
      )}
      <p className={styles.LikeNumber}>{localLikeCount}</p>
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
