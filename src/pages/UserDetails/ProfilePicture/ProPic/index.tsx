import React from "react";
import classNames from "classnames";

import NoAvatar from "../../../../assets/icons/no-avatar.svg";

import styles from "../ProfilePicture.module.scss";

type ProPicProps = {
  avatarImgSrc: string;
  msgShow: boolean;
  setMsgShow: (boolean) => void;
};

function ProPic({ avatarImgSrc, msgShow, setMsgShow }: ProPicProps) {
  if (avatarImgSrc && avatarImgSrc !== "") {
    return (
      <img
        className={classNames(styles.ProPic, {
          [styles.show]: msgShow,
        })}
        src={avatarImgSrc}
        onMouseEnter={() => {
          setMsgShow(true);
        }}
        onMouseLeave={() => {
          setMsgShow(false);
        }}
      />
    );
  }

  return (
    <NoAvatar
      className={classNames(styles.ProPic, {
        [styles.show]: msgShow,
      })}
      onMouseEnter={() => {
        setMsgShow(true);
      }}
      onMouseLeave={() => {
        setMsgShow(false);
      }}
    />
  );
}

export default ProPic;
