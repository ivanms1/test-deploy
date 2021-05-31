import React, { useEffect, useState } from "react";

import styles from "./UpdateChecker.module.scss";

const { api } = window;

function UpdateCheckerProvider({ children }: { children: React.ReactNode }) {
  const [needToUpdateManager, setNeedToUpdateManager] = useState(false);
  useEffect(() => {
    const listener = () => {
      setNeedToUpdateManager(true);
    };

    api.listenToUpdateManager(listener);
  }, []);
  return (
    <>
      {needToUpdateManager ? (
        <div className={styles.Container}>
          <span className={styles.Text}>
            You current version of the conun manager is not compatible, please{" "}
            <a
              href="https://dappstore.conun.io/"
              target="_blank"
              rel="noreferrer"
            >
              update it
            </a>{" "}
            and restart the drive.
          </span>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default UpdateCheckerProvider;
