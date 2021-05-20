import React from "react";
import useGetAppVersion from "../../../hooks/useGetAppVersion";
import useGetLatestRelease from "../../../hooks/useGetLatestRelease";
import styles from "./FootBar.module.scss";

function FootBar() {
  const { version: currentAppVersion } = useGetAppVersion();
  const { latestVersion } = useGetLatestRelease();

  return (
    <div className={styles.FootBar}>
      {currentAppVersion && latestVersion && (
        <>
          <span className={styles.CurrentVersion}>
            Ver. {currentAppVersion}
          </span>
          {currentAppVersion !== latestVersion && (
            <span className={styles.UpdateStatus}>
              A new version is available! Get the new version from{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://dappstore.conun.io/"
              >
                CONUN DApp Store
              </a>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default FootBar;
