import React, { useEffect, useReducer } from "react";

import DownloadItem from "./DownloadItem";

import reducer from "./DownloadQueueReducer";

import styles from "./DownloadQueue.module.scss";

const { api } = window;

function DownloadQueue() {
  const [state, dispatch] = useReducer(reducer, {
    downloads: {},
  });

  useEffect(() => {
    const listener = (data) => {
      dispatch({
        type: "SET_DOWNLOAD_PATH",
        payload: { id: data?.data?.content_id, path: data.path },
      });
    };
    api.listenToDownloadSuccess(listener);
  }, []);

  useEffect(() => {
    const listener = (data) => {
      dispatch({
        type: "ADD_DOWNLOAD",
        payload: {
          id: data?.contentId,
          fileName: data?.name,
          name: data?.title,
          status: "IN_PROGRESS",
          percentage: null,
          path: null,
        },
      });
    };
    api.listenToDownloadStart(listener);
  }, []);

  useEffect(() => {
    const listener = (data) => {
      dispatch({
        type: "SET_DOWNLOAD_PERCENTAGE",
        payload: { id: data?.file?.content_id, percentage: +data.percentage },
      });
    };
    api.listenToDownloadProgress(listener);
  }, []);

  const downloads = Object.keys(state?.downloads);

  return (
    <div className={styles.DownloadQueue}>
      <p className={styles.Title}>Download Queue</p>
      <div>
        {downloads.map((id) => (
          <DownloadItem key={id} download={state?.downloads?.[id]} />
        ))}
      </div>
    </div>
  );
}

export default DownloadQueue;
