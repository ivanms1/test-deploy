import { ipcMain, shell } from "electron";
import fs from "fs";
import fetch from "electron-fetch";
import all from "it-all";
import { concat } from "uint8arrays";
import Jimp from "jimp";
import isDev from "electron-is-dev";

import { mainWindow } from "../";
import { getIpfs } from "../ipfs";
import db from "../store/db";
import connectToWS, { client } from "../socket";
import logger from "../logger";

import { DEV_DRIVE_SERVER, PROD_DRIVE_SERVER } from "../const";

const SERVER_URL = isDev ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

ipcMain.handle("get-file-preview", async (_, hash) => {
  try {
    const node = getIpfs();

    logger("file-preview-logger", `getting preview with hash ${hash}`, "info");

    const preview = concat(await all(node.cat(hash)));

    logger(
      "file-preview-cat-success",
      `preview cat succeeded with hash ${hash}`,
      "info"
    );

    return {
      success: true,
      preview,
    };
  } catch (error) {
    logger("get-file-preview", error?.message, "error");
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("get-file-description", async (_, hash) => {
  try {
    const node = getIpfs();

    logger(
      "cat-file-description",
      `getting file description with hash ${hash}`,
      "info"
    );

    const description = concat(await all(node.cat(hash)));

    logger(
      "cat-file-description",
      `description cat successful with hash ${hash}`,
      "info"
    );

    return {
      success: true,
      description,
    };
  } catch (error) {
    logger("get-file-description", error?.message, "error");
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("download-file", async (_, args) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    logger(
      "downloading-file",
      `sending file ${args.hash} sent to manager`,
      "info"
    );

    client.send(
      JSON.stringify({
        type: "download-content",
        ccid: args?.publicHash,
        user_id: userDetails?.userId,
        content_id: args?.contentId,
        name: args?.name,
        hash: args?.hash,
        size: args?.size,
      })
    );

    mainWindow.webContents.send("download-start", args);

    return {
      success: true,
    };
  } catch (error) {
    logger("download-file", error?.message, "error");

    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("upload-file", async (_, info) => {
  try {
    const node = getIpfs();

    logger("upload-file", `uploading file ${info?.filePath} to ipfs`, "info");

    const handleProgress = (data) => {
      const currentPercentage = ((data * 100) / info?.size).toFixed(2);

      mainWindow.webContents.send("upload-percentage", currentPercentage);
    };
    const file = fs.readFileSync(info.filePath);
    const fileContent = Buffer.from(file);
    const fileHash = await node.add(
      {
        content: fileContent,
      },
      {
        progress: handleProgress,
      }
    );

    logger("upload-file", `sending ${fileHash.path} hash to manager`, "info");

    client.send(
      JSON.stringify({ type: "upload-file", fileHash, price: 0, data: info })
    );

    return {
      success: true,
      fileHash,
    };
  } catch (error) {
    logger("upload-file", error, "error");
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("like-content", async (_, args) => {
  try {
    const userDetails = await db.get("userDetailsDrive");
    logger(
      "like-content",
      `attempting like of file ${args?.publicHash}`,
      "info"
    );
    client.send(
      JSON.stringify({
        type: "like-content",
        ccid: args?.publicHash,
        user_id: userDetails?.userId,
        content_id: args?.contentId,
      })
    );
  } catch (error) {
    logger("like-content", error, "error");
  }
});

ipcMain.handle("get-later-list", async () => {
  try {
    const laterList = await db.get("savedForLaterList");
    logger("get-later-list", "Attempting to load saved for later list", "info");
    return {
      success: true,
      list: laterList,
    };
  } catch (error) {
    logger("get-later-list", error.message, "error");
    return {
      success: false,
      list: null,
    };
  }
});
ipcMain.handle("update-later-list", async (_, newList: any) => {
  try {
    const laterList = await db.get("savedForLaterList");
    logger("update-later-list", "Attempting to update later list", "info");

    const updatedList = await db.put({ ...laterList, list: newList });
    logger("update-later-list", "List updated", "info");
    return {
      success: true,
      list: updatedList,
    };
  } catch (error) {
    logger("update-later-list", error.message, "error");
    return {
      success: false,
      list: null,
    };
  }
});

ipcMain.handle("get-current-user", async () => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    logger(
      "get-current-user",
      `getting current user with wallet ${userDetails?.walletAddress}`,
      "info"
    );

    const res = await fetch(`${SERVER_URL}/user/auth`, {
      method: "POST",
      body: JSON.stringify({
        wallet_id: userDetails?.walletAddress,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const { data } = await res.json();

    const userDriveDetails = await db.get("userDetailsDrive");

    logger("get-current-user", `current user has id ${data?.id}`, "info");

    await db.put({
      ...userDriveDetails,
      userId: data.id,
      walletId: data?.wallet_id,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-current-user", error.message, "error");
    return {
      success: false,
      data: null,
    };
  }
});

ipcMain.handle("upload-avatar", async (_, path) => {
  try {
    const node = getIpfs();

    logger("upload-avatar", `uploading avatar with path ${path}`, "info");

    const bufferizedPath = Buffer.from(path.split(",")[1], "base64");
    const preview = await Jimp.read(bufferizedPath);
    await preview.resize(Jimp.AUTO, 500).quality(95);
    const previewContent = await preview.getBufferAsync(preview.getMIME());
    const previewHash = await node.add({
      content: previewContent,
    });

    return {
      success: true,
      hash: previewHash?.path,
    };
  } catch (error) {
    logger("upload-avatar", error, "error");
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("connect-to-manager", () => {
  try {
    logger("connect-to-manager", "connecting to manager", "info");
    connectToWS();
  } catch (error) {
    logger("connect-to-manager", error?.message, "error");
  }
});

ipcMain.handle("open-file", async (_, path: string) => {
  try {
    await shell.openPath(path);
  } catch (error) {
    logger("open-file", error?.message, "error");
  }
});

ipcMain.handle("get-peers", async () => {
  try {
    const node = getIpfs();

    const peers = await node.swarm.peers();

    return peers;
  } catch (error) {
    logger("get-peers", error?.message, "error");
  }
});
