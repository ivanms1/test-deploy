import React, { useState } from "react";
import { useMutation } from "react-query";

import Modal from "../../../components/Modal";
import ThumbnailEditor from "../../../components/ThumbnailEditor";
import ProPic from "./ProPic";

import useGetImage from "../../../hooks/useGetImage";
import useCurrentUser from "../../../hooks/useCurrentUser";
import { useAppContext } from "../../../components/AppContext";

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

  const [showModal, setShowModal] = useState<boolean>(false);

  const { mutateAsync: uploadAvatar } = useMutation(async (hash: string) => {
    const { data } = await api.updateUser([
      { name: "avatar", value: hash },
    ]);
    return data;
  });

  const onClickSave = async (scaledImgData) => {
    if (scaledImgData) {
      const data = await api.uploadAvatar(scaledImgData);
      await uploadAvatar(data?.hash);
      await refetch();
    }
    setShowModal(false);
  };

  const { isManagerConnected } = useAppContext();

  if (isSelf && isManagerConnected) {
    return (
      <>
        <div className={styles.MyPicBox} onClick={() => setShowModal(true)}>
          <ProPic avatarImgSrc={avatarImgSrc} />
          <span className={styles.EditMessage}>edit</span>
        </div>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ThumbnailEditor
            origImage={avatarImgSrc}
            boxHeight={330}
            boxWidth={330}
            boxRadius={165}
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
