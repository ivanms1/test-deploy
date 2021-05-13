import React, { useState, useEffect } from "react";

import Button from "../Button";
import Tooltip from "../Tooltip";

import useLikeContent from "../../hooks/useLikeContent";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useAppContext } from "../AppContext";

import { FileProps } from "../../types";

import HeartFull from "../../assets/icons/heart-full.svg";
import HeartEmpty from "../../assets/icons/heart-empty.svg";

import styles from "./LikeButton.module.scss";

interface Props {
  file: FileProps;
}

const { api } = window;

function LikeButton({ file }: Props) {
  const [isLiked, setLiked] = useState(file?.is_liked);
  const [likeCount, setLikeCount] = useState(file?.content_stats.likes_cnt);

  const { likeContent } = useLikeContent();
  const { currentUser } = useCurrentUser();
  const { isManagerConnected } = useAppContext();

  const handleLike = async () => {
    await likeContent({
      userId: currentUser?.id,
      contentId: file?.id,
      publicHash: file?.info?.public_hash,
    });

    setLiked(true);
    setLikeCount((prev) => prev + 1);
  };

  return (
    <div className={styles.LikeButton}>
      {isLiked ? (
        <HeartFull className={styles.Heart} />
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
            <HeartEmpty className={styles.Heart} />
          </Button>
        </Tooltip>
      )}
      <span className={styles.Count}>{likeCount}</span>
    </div>
  );
}

export default LikeButton;
