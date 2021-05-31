import React from "react";

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
    <div className={styles.SimilarCell}>
      <Thumbnail
        imgSrc={thumbImgSrc}
        className={styles.Thumbnail}
        link={`/file/${file.id}`}
        fileForList={file}
      />
      <div className={styles.Text}>{trunc(file.name, 70)}</div>
    </div>
  );
}

export default SimilarCell;
