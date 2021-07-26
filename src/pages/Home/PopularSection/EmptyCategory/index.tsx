import React from "react";

import styles from "./EmptyCategory.module.scss";

function EmptyCategory() {
  return (
    <div className={styles.EmptyCategory}>
      <p>Looks like this category is empty.</p>
      <p>Be the first to add something!</p>
    </div>
  );
}

export default EmptyCategory;
