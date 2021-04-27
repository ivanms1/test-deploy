import React from "react";
import { Link } from "react-router-dom";

import Button from "../../../../components/Button";

import useGetImage from "../../../../hooks/useGetImage";

import CopyIcon from "../../../../assets/icons/copy.svg";
import NoAvatar from "../../../../assets/icons/no-avatar.svg";

import styles from "./UserDetails.module.scss";

function Avatar({ avatar }: { avatar: string }) {
  const { data: avatarImgSrc } = useGetImage(avatar);

  if (avatar) {
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
          <div className={styles.CopyBtn}>
            <Button
              noStyle
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
              }}
            >
              <CopyIcon className={styles.CopyIcon} />
            </Button>
          </div>
        </div>
        {/* Follow btn goes here later */}
      </div>
    </div>
  );
}
export default UserDetails;
