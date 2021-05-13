import React from "react";
import { Link } from "react-router-dom";

import useGetImage from "../../../../hooks/useGetImage";

import NoAvatar from "../../../../assets/icons/no-avatar.svg";

import styles from "./UserDetails.module.scss";
import CopyButton from "../../../../components/CopyButton";

function Avatar({ avatar }: { avatar: string }) {
  const { data: avatarImgSrc } = useGetImage(avatar);

  if (avatarImgSrc) {
    return <img src={avatarImgSrc} className={styles.Avatar} />;
  }
  return <NoAvatar className={styles.Avatar} />;
}

function UserDetails({
  userID,
  walletAddress,
  avatar,
}: {
  userID: number;
  walletAddress: string;
  avatar: string;
}) {
  return (
    <div className={styles.UserDetails}>
      <Link
        to={`/user-details?user=${userID}&walletHash=${walletAddress}&avatar=${avatar}`}
      >
        <Avatar avatar={avatar} />
      </Link>
      <div className={styles.Text}>
        <div className={styles.IDBits}>
          <div className={styles.Label}>ID</div>
          <div className={styles.IDHash}>{walletAddress}</div>
          <CopyButton walletAdd={walletAddress} />
        </div>
        {/* Follow btn goes here later */}
      </div>
    </div>
  );
}
export default UserDetails;
