import fetch from "electron-fetch";
import isDev from "electron-is-dev";

import jimp from "jimp";
import qrcode from "qrcode";
import QRReader from "qrcode-reader";

import logger from "../logger";
import db from "../store/db";

import { DEV_DRIVE_SERVER, PROD_DRIVE_SERVER } from "../const";

const SERVER_URL = isDev ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

async function getFileIDfromPHash(argv: string) {
  const publicHash = argv.split("conun-drive://")[1];
  logger("get-file-id-from-hash", `checking for current user ID`, "info");

  const userDetails = await db.get("userDetailsDrive");

  if (!userDetails.userId) {
    logger(
      "get-file-id-from-hash",
      `user ID not present. Not logged in?`,
      "info"
    );
    return "/file/NO_USER";
  }

  logger(
    "get-file-id-from-hash",
    `Found current user with id ${userDetails?.userId}`,
    "info"
  );
  const res = await fetch(
    `${SERVER_URL}/search/content?keyword=${publicHash}&filter=cid`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "current-user": userDetails?.userId,
      },
    }
  );

  const { data } = await res.json();
  if (data?.data && data.data[0]?.id) {
    logger(
      "get-file-id-from-hash",
      `Received this id: ${data.data[0].id}`,
      "info"
    );
    return `/file/${data.data[0]?.id}`;
  }
  logger("get-file-id-from-hash", `Received no id: ${data.data}`, "info");

  return "/file/NO_BAD_FILE";
}

export async function getURLFromArgv(argv) {
  try {
    const res = await getFileIDfromPHash(argv);
    logger("Push to file:", `Direct link to file - SUCCESS: ${argv}`, "error");
    return res;
  } catch {
    logger("Push to file:", `Direct link to file - FAILED: ${argv}`, "error");
    return null;
  }
}

export async function createQRCode(fileURL: string) {
  const fileQrCode = await qrcode.toDataURL(fileURL);
  return fileQrCode;
}

export async function readQRCode(qrCodePath: string) {
  const img = await jimp.read(qrCodePath);

  const qr = new QRReader();

  const value: any = await new Promise((resolve, reject) => {
    qr.callback = (err: any, v: any) =>
      err != null ? reject(err) : resolve(v);
    qr.decode(img.bitmap);
  });
  if (value?.result) {
    const internalPath = await getFileIDfromPHash(value?.result);

    return { success: true, qrDecode: internalPath };
  }
  return { success: false, qrDecode: null };
}
