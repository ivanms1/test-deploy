import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { toast } from "react-toastify";

import Button from "../../components/Button";

import useUpdateLaterList from "../../hooks/useUpdateLaterList";
import useGetLaterList from "../../hooks/useGetLaterList";

import { FileProps } from "../../types";

import AddIcon from "../../assets/icons/addToList.svg";

import styles from "./Thumbnail.module.scss";

interface ListProps {
  file: FileProps;
}

function ListButton({ file }: ListProps) {
  const { list, refetch } = useGetLaterList();
  const { updateList } = useUpdateLaterList();

  const HandleListAdd = async (file: FileProps) => {
    if (list.some((i) => i.id === file.id)) {
      toast.warning(`File "${file.name}" is already on the list!`, {
        autoClose: 1500,
        position: "bottom-center",
      });
    } else {
      await updateList([...list, file]);

      toast.success(`File "${file.name}" added to 'Saved for later'!`, {
        autoClose: 1500,
        position: "bottom-center",
      });
      refetch();
    }
  };

  return (
    <Button
      className={styles.ShareButton}
      noStyle
      onClick={() => HandleListAdd(file)}
    >
      <AddIcon className={styles.Icon} />
    </Button>
  );
}

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
        {fileForList && <ListButton file={fileForList} />}
      </div>
    );
  }
  return (
    <div className={classNames(className, styles.NoImage, styles.Container)}>
      No peers available
      {fileForList && <ListButton file={fileForList} />}
    </div>
  );
}

export default Thumbnail;
