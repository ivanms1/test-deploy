import React from "react";

import { toast } from "react-toastify";

import Button from "../Button";

import useGetLaterList from "../../hooks/useGetLaterList";
import useUpdateLaterList from "../../hooks/useUpdateLaterList";

import { FileProps } from "../../types";

import AddIcon from "../../assets/icons/addToList.svg";

import styles from "./AddToList.module.scss";

interface ListProps {
  file: FileProps;
}

function AddToListButton({ file }: ListProps) {
  const { list, refetch } = useGetLaterList();
  const { updateList } = useUpdateLaterList();

  const handleListAdd = async (file: FileProps) => {
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
      className={styles.ListButton}
      noStyle
      onClick={() => handleListAdd(file)}
    >
      <AddIcon className={styles.Icon} />
    </Button>
  );
}

export default AddToListButton;
