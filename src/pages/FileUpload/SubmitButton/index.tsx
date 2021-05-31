import React, { useEffect, useState } from "react";

import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";

import { useAppContext } from "../../../components/AppContext";

import styles from "./SubmitButton.module.scss";
import { toast } from "react-toastify";

const { api } = window;

const FORM_DEFAULT_VALUES = {
  title: "",
  file: "",
  thumbnail: "",
  description: "",
  tags: [],
  category: null,
  type: null,
};

function SubmitButton({ reset }) {
  const [buttonLabel, setButtonLabel] = useState("Upload Content");
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const { isManagerConnected } = useAppContext();

  useEffect(() => {
    const listener = (percentage) => {
      setButtonLabel(`${Math.ceil(Math.ceil(percentage))}%`);
      setUploadPercentage(percentage);
    };
    api.listenToUploadProgress(listener);

    return () => api.removeListeners("upload-percentage");
  }, []);

  useEffect(() => {
    api.listenToError(() => {
      setButtonLabel("Upload Content");
      setUploadPercentage(null);
    });
  }, []);

  useEffect(() => {
    const listener = () => {
      reset(FORM_DEFAULT_VALUES);
      setButtonLabel("Upload Complete");

      setTimeout(() => {
        setButtonLabel("Upload Content");
        setUploadPercentage(null);
      }, 2000);
    };
    api.listenToUploadSuccess(listener);

    return () => api.removeListeners("upload-success");
  }, []);

  if (isManagerConnected) {
    return (
      <Button
        type="submit"
        noStyle
        className={styles.UploadButton}
        disabled={!!uploadPercentage}
      >
        <div
          className={styles.Progress}
          style={{ width: `${uploadPercentage || 0}%` }}
        >
          <div className={styles.Label}>{buttonLabel}</div>
        </div>
      </Button>
    );
  }

  return (
    <Tooltip id="upload-button">
      <Button
        type="button"
        className={styles.UploadButton}
        data-for="upload-button"
        data-tip="Connect to Conun manager in order to upload"
      >
        Upload Content
      </Button>
    </Tooltip>
  );
}

export default SubmitButton;
