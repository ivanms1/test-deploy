import React from "react";

import useMakeQRCode from "../../../../hooks/useMakeQRCode";

import styles from "./QRBox.module.scss";

function QRBox({ publicHash }: { publicHash: string }) {
  const qrCodeSrc = useMakeQRCode(publicHash);

  return (
    <div className={styles.QRBox}>
      {qrCodeSrc && (
        <img src={qrCodeSrc} className={styles.QRCodeImg} alt="qr code" />
      )}
    </div>
  );
}

export default QRBox;
