import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import SavedSearchFiles from "./SavedSearchFiles";
import OutsideClickHandler from "../../OutsideClickHandler";
import Button from "../../Button";

import { useAppContext } from "../../AppContext";

import getSavedSearches, {
  removeSavedSearch,
} from "../../../helpers/getSavedSearches";

import GlassIcon from "../../../assets/icons/magnifying-glass.svg";
import RemoveIcon from "../../../assets/icons/remove-icon.svg";
import AddIcon from "../../../assets/icons/add.svg";
import SaveSearchIcon from "../../../assets/icons/save-search.svg";
import HomeIcon from "../../../assets/icons/home.svg";

import styles from "./SavedSearchSidebar.module.scss";

const variants = {
  open: { x: 0 },
  closed: { x: 276 },
};

function SavedSearchSidebar() {
  const { isSavedSearchOpen, handleSavedSearchBar } = useAppContext();

  const [savedSearches, setSavedSearches] = useState(getSavedSearches() || []);

  useEffect(() => {
    setSavedSearches(getSavedSearches() || []);
  }, [isSavedSearchOpen]);

  return (
    <OutsideClickHandler onClickOutside={() => handleSavedSearchBar(false)}>
      <motion.div
        className={classNames(styles.Sidebar)}
        initial="closed"
        animate={isSavedSearchOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
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
        <p className={styles.Title}>Saved Searches</p>
        <div className={styles.SavedSearchesContainer}>
          {savedSearches.map((search) => (
            <div
              key={search.search.keyword + search.search.filter}
              className={styles.Search}
            >
              <div className={styles.SearchHeader}>
                <GlassIcon className={styles.GlassIcon} />
                <p className={styles.SearchTitle}>{search.title}</p>
                <Button
                  type="button"
                  className={styles.RemoveButton}
                  onClick={() => {
                    const updatedSearchesList = removeSavedSearch(search);
                    setSavedSearches(updatedSearchesList);
                  }}
                  noStyle
                >
                  <RemoveIcon className={styles.RemoveIcon} />
                </Button>
              </div>
              <div className={styles.FilesContainer}>
                <SavedSearchFiles search={search?.search} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </OutsideClickHandler>
  );
}

export default SavedSearchSidebar;
