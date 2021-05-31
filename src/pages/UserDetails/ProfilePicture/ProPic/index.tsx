import React from "react";

import NoAvatar from "../../../../assets/icons/no-avatar.svg";

import styles from "../ProfilePicture.module.scss";

type ProPicProps = {
  avatarImgSrc: string;
};

function ProPic({ avatarImgSrc }: ProPicProps) {
  if (avatarImgSrc && avatarImgSrc !== "") {
    return <img className={styles.ProPic} src={avatarImgSrc} />;
  }

  return <NoAvatar className={styles.ProPic} />;
}

export default ProPic;
