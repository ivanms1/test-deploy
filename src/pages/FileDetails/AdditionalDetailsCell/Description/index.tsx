import React from "react";
import useGetDescription from "../../../../hooks/useGetDescription";

import styles from "./Description.module.scss";

function Description({ descriptionHash }: { descriptionHash: string }) {
  const { data } = useGetDescription(descriptionHash);

  return (
    <div className={styles.ItemDescription}>
      <div className={styles.BoxTitle}>Description</div>
      <div className={styles.DescriptionText}>{data && data}</div>
    </div>
  );
}

export default Description;
