import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import AddToListButton from "../../components/AddToListButton";

import { FileProps } from "../../types";

import styles from "./Thumbnail.module.scss";
import ShareButton from "../ShareButton";

type Props = {
  imgSrc: string;
  className: string;
  fileForList?: FileProps;
  link?: string;
};

function Thumbnail({ imgSrc, className, fileForList, link }: Props) {
  if (imgSrc) {
    return (
      <div className={classNames(className, styles.Container)}>
        {link ? (
          <Link to={link}>
            <img className={styles.Image} src={imgSrc} />
          </Link>
        ) : (
          <img className={styles.Image} src={imgSrc} />
        )}
        <div className={styles.HoverButton}>
          {fileForList && <AddToListButton file={fileForList} />}
          <ShareButton fileID={fileForList?.info.public_hash} />
        </div>
      </div>
    );
  }
  return (
    <div className={classNames(className, styles.NoImage, styles.Container)}>
      <Link to={link} className={styles.Link}>
        No peers available
        <div className={styles.HoverButton}>
          {fileForList && <AddToListButton file={fileForList} />}
          <ShareButton fileID={fileForList?.info.public_hash} />
        </div>
      </Link>
    </div>
  );
}

export default Thumbnail;
