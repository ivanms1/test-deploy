import React from "react";
import { Link } from "react-router-dom";

import Button from "../../Button";
import SearchBar from "./SearchBar";

import { useAppContext } from "../../AppContext";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useGetImage from "../../../hooks/useGetImage";

import AddIcon from "../../../assets/icons/add.svg";
import SaveSearchIcon from "../../../assets/icons/save-search.svg";
import NoAvatar from "../../../assets/icons/no-avatar.svg";
import HomeIcon from "../../../assets/icons/home.svg";

import styles from "./TopSection.module.scss";

function TopSection() {
  const { handleSavedSearchBar, isSavedSearchOpen } = useAppContext();
  const { currentUser } = useCurrentUser();
  const { data: avatarImgSrc } = useGetImage(currentUser?.avatar);

  return (
    <div className={styles.TopSection}>
      <div className={styles.UserAndSearchBar}>
        <Link
          className={styles.UserPicture}
          to={`/user-details?user=${currentUser?.id}&walletHash=${currentUser?.wallet_id}&avatar=${currentUser?.avatar}`}
        >
          {avatarImgSrc ? (
            <img
              className={styles.Picture}
              src={avatarImgSrc}
              alt="user profile"
            />
          ) : (
            <NoAvatar className={styles.Picture} />
          )}
        </Link>
        <SearchBar />
      </div>
      <div className={styles.ActionsBar}>
        <Link className={styles.ActionButtonAdd} to="/">
          <HomeIcon className={styles.Icon} />
        </Link>
        <Link className={styles.ActionButtonAdd} to="/file-upload">
          <AddIcon className={styles.Icon} />
        </Link>
        <Button
          className={styles.ActionButton}
          onClick={() => handleSavedSearchBar(!isSavedSearchOpen)}
          variant="grey"
        >
          <SaveSearchIcon className={styles.Icon} />
        </Button>
      </div>
    </div>
  );
}

export default TopSection;
