import React, { useRef, useState } from "react";
import classNames from "classnames";
import { useMutation } from "react-query";

import useGetImage from "../../../hooks/useGetImage";
import useCurrentUser from "../../../hooks/useCurrentUser";

import instance from "../../../axios/instance";

import NoAvatar from "../../../assets/icons/no-avatar.svg";

import styles from "./ProfilePicture.module.scss";

const { api } = window;

type ProPicProps = {
  avatarImgSrc: string;
  handleEditPic: () => void;
  msgShow: boolean;
  setMsgShow: (boolean) => void;
};

function ProPic({
  avatarImgSrc,
  handleEditPic,
  msgShow,
  setMsgShow,
}: ProPicProps) {
  if (avatarImgSrc) {
    return (
      <img
        className={classNames(styles.ProPic, {
          [styles.show]: msgShow,
        })}
        src={avatarImgSrc}
        onClick={() => handleEditPic()}
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
      onClick={() => handleEditPic()}
      onMouseEnter={() => {
        setMsgShow(true);
      }}
      onMouseLeave={() => {
        setMsgShow(false);
      }}
    />
  );
}

function ProfilePicture({
  avatar,
  isSelf,
}: {
  avatar: string;
  isSelf: boolean;
}) {
  const { currentUser, refetch } = useCurrentUser();
  const { data: avatarImgSrc } = useGetImage(
    isSelf ? currentUser?.avatar : avatar
  );

  const [msgShow, setMsgShow] = useState<boolean>(false);

  const { mutateAsync: uploadAvatar } = useMutation(async (hash: string) => {
    const formData = new FormData();
    formData.append("avatar", hash);
    const { data } = await instance.put(`/user/${currentUser?.id}`, formData);
    return data;
  });

  const inputRef = useRef(null);

  const handleEditPic = () => {
    inputRef.current.click();
  };

  const handleAvatarUpload = async (e) => {
    const avatarToUpload = e.target.files[0];
    const data = await api.uploadAvatar(avatarToUpload?.path);
    await uploadAvatar(data?.hash);
    await refetch();
  };

  if (isSelf) {
    return (
      <div className={styles.MyPicBox}>
        <ProPic
          avatarImgSrc={avatarImgSrc}
          handleEditPic={handleEditPic}
          msgShow={msgShow}
          setMsgShow={setMsgShow}
        />
        <input
          type="file"
          onChange={handleAvatarUpload}
          className={styles.HiddenInput}
          ref={inputRef}
          accept="image/x-png,image/gif,image/jpeg"
        />
        <span
          className={classNames(styles.EditMessage, {
            [styles.show]: msgShow,
          })}
          onMouseEnter={() => {
            setMsgShow(true);
          }}
          onMouseLeave={() => {
            setMsgShow(false);
          }}
        >
          edit
        </span>
      </div>
    );
  }
  return (
    <div className={styles.PicBox}>
      {avatarImgSrc && avatarImgSrc !== "" ? (
        <img className={styles.ProPic} src={avatarImgSrc} />
      ) : (
        <NoAvatar className={styles.ProPic} />
      )}
    </div>
  );
}

export default ProfilePicture;
