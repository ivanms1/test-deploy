import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import classnames from "classnames";
import { motion } from "framer-motion";

import Button from "../../components/Button";
import ProfileText from "./ProfileText";
import ProfilePicture from "./ProfilePicture";
import FilesHorizontalViewer from "../../components/FilesHorizontalViewer";

import useCurrentUser from "../../hooks/useCurrentUser";
import useGetDownloads from "../../hooks/useGetDownloads";
import useGetUploads from "../../hooks/useGetUploads";

import BackIcon from "../../assets/icons/back.svg";

import { filePageAnimation } from "../../anim";

import styles from "./UserDetails.module.scss";

const LIMIT = "10";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function BackButton() {
  const history = useHistory();
  return (
    <div className={styles.BackButton}>
      <Button noStyle onClick={() => history.goBack()}>
        <BackIcon className={styles.Icon} />
      </Button>
    </div>
  );
}

function UserDetails() {
  const query = useQuery();
  const authorID = query.get("user");
  const walletHash = query.get("walletHash");
  const avatar = query.get("avatar");

  const { currentUser } = useCurrentUser();

  const isSelf = currentUser?.id.toString() === authorID.toString();

  const { data: uploadsData } = useGetUploads({ authorID, limit: LIMIT });
  const { data: downloadsData } = useGetDownloads({
    enabled: isSelf,
    limit: LIMIT,
  });
  return (
    <motion.div
      className={styles.Background}
      variants={filePageAnimation}
      initial="exit"
      animate="enter"
      exit="exit"
    >
      <BackButton />
      <div className={styles.Layout}>
        <div className={styles.UserInfo}>
          <ProfilePicture avatar={avatar} isSelf={isSelf} />
          <ProfileText authorID={authorID} walletHash={walletHash} />
        </div>
        <div className={classnames(styles.FileBox, { [styles.Solo]: !isSelf })}>
          <div className={styles.Header}>
            <span className={styles.Title}>
              {isSelf ? "My Uploads" : "This User's Uploads"}
            </span>
            {uploadsData?.total > 4 && (
              <span className={styles.SeeMore}>
                <Link to={`/user-uploads/${authorID}`}>SEE MORE</Link>
              </span>
            )}
          </div>

          {uploadsData?.total >= 1 ? (
            <FilesHorizontalViewer files={uploadsData?.data} />
          ) : (
            <div className={styles.NoDataMessage}>
              {isSelf ? "You haven't" : "This user hasn't"} uploaded anything
              yet.
            </div>
          )}
        </div>
        {isSelf && (
          <div className={styles.FileBox}>
            <div className={styles.Header}>
              <span className={styles.Title}>My Downloads</span>
              <span className={styles.SeeMore}>
                {downloadsData?.total > 4 && (
                  <Link to={`/user-downloads/`}>SEE MORE</Link>
                )}
              </span>
            </div>
            {downloadsData?.total >= 1 ? (
              <FilesHorizontalViewer files={downloadsData?.data} />
            ) : (
              <div className={styles.NoDataMessage}>
                You haven&apos;t downloaded anything yet.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UserDetails;
