import React from "react";
import styles from "./Thumbnail.module.scss";

type Props = {
  imgSrc: string;
  className: string;
};

function Thumbnail({ imgSrc, className }: Props) {
  if (imgSrc) {
    return <img className={className} src={imgSrc} />;
  }
  return <div className={styles.NoImage}>No peers available</div>;
}

export default Thumbnail;
