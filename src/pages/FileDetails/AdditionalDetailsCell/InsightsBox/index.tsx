import React from "react";

import styles from "./InsightsBox.module.scss";

function InsightsBox() {
  return (
    <div className={styles.InsightsBox}>
      <div className={styles.BoxTitle}>Insights</div>

      <span className={styles.UploadedDate}>Uploaded May 24, 2021</span>
      <span className={styles.UpdatedDate}>Updated June 15, 2021</span>
    </div>
  );
}

export default InsightsBox;
