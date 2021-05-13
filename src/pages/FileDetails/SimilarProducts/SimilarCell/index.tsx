import React from "react";
import { Link } from "react-router-dom";

import Thumbnail from "../../../../components/Thumbnail";

import useGetImage from "../../../../hooks/useGetImage";

import trunc from "../../../../helpers/trunc";

import { FileProps } from "../../../../types";

import styles from "./SimilarCell.module.scss";

interface SimProps {
  file: FileProps;
}

function SimilarCell({ file }: SimProps) {
  const { data: thumbImgSrc } = useGetImage(file.info.thumbnail);

  return (
    <Link to={`/file/${file.id}`}>
      <div className={styles.SimilarCell}>
        <Thumbnail imgSrc={thumbImgSrc} className={styles.Thumbnail} />
        <div className={styles.Text}>{trunc(file.name, 70)}</div>
      </div>
    </Link>
  );
}

export default SimilarCell;
