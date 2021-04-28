import React, { useState } from "react";
import classNames from "classnames";
import { useMutation } from "react-query";

import Modal from "../../../components/Modal";
import ThumbnailEditor from "../../../components/ThumbnailEditor";
import ProPic from "./ProPic";

import useGetImage from "../../../hooks/useGetImage";
import useCurrentUser from "../../../hooks/useCurrentUser";

import instance from "../../../axios/instance";

import NoAvatar from "../../../assets/icons/no-avatar.svg";

import styles from "./ProfilePicture.module.scss";

const { api } = window;

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
  const [showModal, setShowModal] = useState<boolean>(false);

  const { mutateAsync: uploadAvatar } = useMutation(async (hash: string) => {
    const formData = new FormData();
    formData.append("avatar", hash);
    const { data } = await instance.put(`/user/${currentUser?.id}`, formData);
    return data;
  });

  const onClickSave = async (editorRef) => {
    if (editorRef) {
      const scaledImage = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL();
      const data = await api.uploadAvatar(scaledImage);
      await uploadAvatar(data?.hash);
      await refetch();
    }
    setShowModal(false);
  };

  if (isSelf) {
    return (
      <>
        <div className={styles.MyPicBox} onClick={() => setShowModal(true)}>
          <ProPic
            avatarImgSrc={avatarImgSrc}
            msgShow={msgShow}
            setMsgShow={setMsgShow}
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
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ThumbnailEditor
            origImage={avatarImgSrc}
            boxHeight={220}
            boxWidth={220}
            boxRadius={110}
            handleUploadProcess={onClickSave}
          />
        </Modal>
      </>
    );
  }
  return (
    <div className={styles.PicBox}>
      {avatarImgSrc ? (
        <img className={styles.ProPic} src={avatarImgSrc} />
      ) : (
        <NoAvatar className={styles.ProPic} />
      )}
    </div>
  );
}

export default ProfilePicture;
