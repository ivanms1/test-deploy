import { ipcMain } from "electron";
import fs from "fs";
import fetch from "electron-fetch";
import all from "it-all";
import { concat } from "uint8arrays";
import Jimp from "jimp";

import { mainWindow, node } from "../";
import db from "../store/db";
import connectToWS, { client } from "../socket";

import { DEV_DRIVE_SERVER, PROD_DRIVE_SERVER } from "../const";

const SERVER_URL =
  process.env.NODE_ENV === "development" ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

ipcMain.handle("get-file-preview", async (_, hash) => {
  try {
    const preview = concat(await all(node.cat(hash)));

    return {
      success: true,
      preview,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("get-file-description", async (_, hash) => {
  try {
    const description = concat(await all(node.cat(hash, { timeout: 5000 })));

    return {
      success: true,
      description,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("download-file", async (_, args) => {
  try {
    // eslint-disable-next-line
    for await (const file of node.get(args.hash)) {
      // eslint-disable-next-line
      if (!file.content) continue;

      const content = [];

      // eslint-disable-next-line
      for await (const chunk of file.content) {
        content.push(chunk);
      }

      try {
        client.send(
          JSON.stringify({
            type: "download-content",
            ccid: args?.publicHash,
            user_id: args?.userId,
            content_id: args?.contentId,
          })
        );
      } catch (error) {
        //
      }

      return {
        success: true,
        file: content,
      };
    }

    return {
      success: false,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("upload-file", async (_, info) => {
  try {
    mainWindow.webContents.send("is-registering-file", true);
    const file = fs.readFileSync(info.filePath);
    const fileContent = Buffer.from(file);
    const fileHash = await node.add({
      content: fileContent,
    });

    client.send(
      JSON.stringify({ type: "upload-file", fileHash, price: 0, data: info })
    );

    return {
      success: true,
      fileHash,
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("like-content", (_, args) => {
  try {
    client.send(
      JSON.stringify({
        type: "like-content",
        ccid: args?.publicHash,
        user_id: args?.userId,
        content_id: args?.contentId,
      })
    );
  } catch (error) {
    console.log(`error`, error);
  }
});

ipcMain.handle("get-current-user", async () => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(`${SERVER_URL}/user/auth`, {
      method: "POST",
      body: JSON.stringify({
        wallet_id:
          userDetails?.walletAddress ??
          "0xe4FD245bf3A78D414cFceec73d01b53959635935",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const { data } = await res.json();

    const userDetailsDrive = await db.get("userDetailsDrive");

    await db.put({
      ...userDetailsDrive,
      userId: data.id,
      walletId: data?.wallet_id,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
});

ipcMain.handle("upload-avatar", async (_, path) => {
  try {
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
    return {
      success: false,
      error: String(error),
    };
  }
});

ipcMain.handle("connect-to-manager", () => connectToWS());
