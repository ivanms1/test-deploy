import React from "react";

import { saveAs } from "file-saver";

import useMakeQRCode from "../../../../hooks/useMakeQRCode";

import styles from "./QRBox.module.scss";
import Button from "../../../../components/Button";

function QRBox({ publicHash, title }: { publicHash: string; title: string }) {
  const qrCodeSrc = useMakeQRCode(publicHash);

  return (
    <div className={styles.QRBox}>
      {qrCodeSrc && (
        <Button
          noStyle
          onClick={() => saveAs(qrCodeSrc, `ConunDrive_QR_${title}.png`)}
        >
          <img src={qrCodeSrc} className={styles.QRCodeImg} alt="qr code" />
        </Button>
      )}
    </div>
  );
}

export default QRBox;
