import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Button from "../../components/Button";
import ProfileText from "./ProfileText";
import ProfilePicture from "./ProfilePicture";
import FilesHorizontalViewer from "../../components/FilesHorizontalViewer";

import useGetUploads from "../../hooks/useGetUploads";
import useGetDownloads from "../../hooks/useGetDownloads";

import BackIcon from "../../assets/icons/back.svg";

import styles from "./UserDetails.module.scss";
import useCurrentUser from "../../hooks/useCurrentUser";

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
    <div className={styles.Background}>
      <BackButton />
      <div className={styles.Layout}>
        <div className={styles.UserInfo}>
          <ProfilePicture avatar={avatar} isSelf={isSelf} />
          <ProfileText authorID={authorID} walletHash={walletHash} />
        </div>
        <div className={styles.FileBox}>
          <div className={styles.Header}>
            <span className={styles.Title}>
              {isSelf ? "My Uploads" : "This User's Uploads"}
            </span>
            {uploadsData?.length > 10 && (
              <span className={styles.SeeMore}>
                <Link to={`/user-uploads/${authorID}`}>SEE MORE</Link>
              </span>
            )}
          </div>

          {downloadsData?.length >= 1 ? (
            <FilesHorizontalViewer files={uploadsData?.data} />
          ) : (
            <div className={styles.NoDataMessage}>
              {isSelf ? "You haven't" : "This user hasn;t"} uploaded anything
              yet.
            </div>
          )}
        </div>
        {isSelf && (
          <div className={styles.FileBox}>
            <div className={styles.Header}>
              <span className={styles.Title}>My Downloads</span>
              <span className={styles.SeeMore}>
                {downloadsData?.length > 10 && (
                  <Link to={`/user-downloads/`}>SEE MORE</Link>
                )}
              </span>
            </div>
            {downloadsData?.length >= 1 ? (
              <FilesHorizontalViewer files={downloadsData?.data} />
            ) : (
              <div className={styles.NoDataMessage}>
                You haven&apos;t downloaded anything yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
