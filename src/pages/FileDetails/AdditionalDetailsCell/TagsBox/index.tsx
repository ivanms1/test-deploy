import React from "react";

import styles from "./TagsBox.module.scss";

function TagsBox({ tags }: { tags: string[] }) {
  return (
    <div className={styles.TagsBox}>
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <span key={tag} className={styles.Tag}>
            {tag}
          </span>
        ))
      ) : (
        <span className={styles.NoTag}>No tags</span>
      )}
    </div>
  );
}

export default TagsBox;
