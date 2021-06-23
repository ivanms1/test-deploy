import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

import Button from "../Button";

import styles from "./ThumbnailEditor.module.scss";

interface EditorProps {
  origImage: string;
  boxHeight: number;
  boxWidth: number;
  boxRadius: number;
  handleUploadProcess: (imgData: string) => void;
}

function ThumbnailEditor({
  origImage,
  boxHeight,
  boxWidth,
  boxRadius,
  handleUploadProcess,
}: EditorProps) {
  const inputRef = useRef(null);
  const editorRef = useRef(null);

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgScale, setImgScale] = useState<number>(1);

  function getScaledImage(editorRef) {
    if (editorRef) {
      const scaledImage = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL();

      return scaledImage;
    }
  }

  return (
    <div className={styles.ThumbnailEditor}>
      <div className={styles.Button}>
        <Button onClick={() => inputRef.current.click()}>
          Upload New File
        </Button>
      </div>
      <AvatarEditor
        ref={editorRef}
        image={imgFile || origImage}
        scale={imgScale}
        height={boxHeight}
        width={boxWidth}
        borderRadius={boxRadius}
      />
      <div className={styles.Controls}>
        <span>Scale:</span>
        <input
          type="range"
          step="0.02"
          min="1"
          max="4"
          name="scale"
          value={imgScale}
          onChange={(e) => setImgScale(Number(e.target.value))}
        />
      </div>
      {/* Hidden Input here: */}
      <input
        type="file"
        onChange={(e) => setImgFile(e.target.files[0])}
        className={styles.HiddenInput}
        ref={inputRef}
        accept="image/x-png,image/gif,image/jpeg"
      />
      <div className={styles.Button}>
        <Button
          onClick={() => {
            const scaledImgData = getScaledImage(editorRef);
            handleUploadProcess(scaledImgData);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ThumbnailEditor;
