import React from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import FileBox from "../FileBox";
import FileBoxMini from "../FileBox/FileBoxMini";

import { FileProps } from "../../types";

import styles from "./FilesHorizontalViewer.module.scss";

interface FilesHorizontalViewerProps {
  files: FileProps[];
  mini?: boolean;
}

function FilesHorizontalViewer({ files, mini }: FilesHorizontalViewerProps) {
  if (mini) {
    return (
      <ScrollContainer className={styles.FilesContainer}>
        {files?.map((file) => (
          <FileBoxMini key={file.id} file={file} />
        ))}
      </ScrollContainer>
    );
  }

  return (
    <ScrollContainer className={styles.FilesContainer}>
      {files?.map((file) => (
        <FileBox key={file.id} file={file} />
      ))}
    </ScrollContainer>
  );
}

export default FilesHorizontalViewer;
