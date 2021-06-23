import React from "react";

import ConunLogo from "../../../assets/icons/conun.svg";

import styles from "./NoUserPage.module.scss";

function NoUserPage() {
  return (
    <div className={styles.NoUserPage}>
      <ConunLogo className={styles.Logo} />
      <div className={styles.Title}>No User Information Found!</div>
      <div className={styles.Message}>
        Close the Conun Drive app, and log into the Conun Manager app before
        reopening Conun Drive.
      </div>
    </div>
  );
}

export default NoUserPage;
