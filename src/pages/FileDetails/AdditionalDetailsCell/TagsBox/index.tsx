import React from "react";
import { Link } from "react-router-dom";

import styles from "./TagsBox.module.scss";

function TagsBox({ tags }: { tags: string[] }) {
  return (
    <div className={styles.TagsBox}>
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <Link key={tag} to={`/search?keyword=${tag}&filter=tags&page=1`}>
            <span className={styles.Tag}>{tag}</span>
          </Link>
        ))
      ) : (
        <span className={styles.NoTag}>No tags</span>
      )}
    </div>
  );
}

export default TagsBox;
