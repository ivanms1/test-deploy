import { app } from "electron";
import Jimp from "jimp";
import fetch from "electron-fetch";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { mainWindow, node } from "../";
import db from "../store/db";

import { DEV_DRIVE_SERVER, PROD_DRIVE_SERVER } from "../const";

const SERVER_URL =
  process.env.NODE_ENV === "development" ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

const MANAGER_PORT = 17401;

export let client: W3CWebSocket | null;

function connectToWS() {
  client = new W3CWebSocket(`ws://127.0.0.1:${MANAGER_PORT}`);

  client.onopen = () => {
    if (mainWindow) {
      mainWindow.webContents.send("is-manager-connected", true);
    }

    client.send(
      JSON.stringify({
        type: "get-drive-path",
        path: app.getPath("exe"),
      })
    );
  };

  client.onclose = () => {
    if (mainWindow) {
      mainWindow.webContents.send("is-manager-connected", false);
    }
  };

  client.onerror = () => {
    if (mainWindow) {
      mainWindow.webContents.send("is-manager-connected", false);
    }
  };

  client.onmessage = async (message) => {
    if (typeof message.data === "string") {
      const data = JSON.parse(message?.data);
      if (data.type === "send-user-details") {
        try {
          const userDetails = await db.get("userDetailsDrive");
          await db.put({
            ...userDetails,
            walletAddress: data?.walletAddress,
          });
        } catch (error) {
          console.log(`error`, error);
        }
      }

      if (data.type === "upload-success") {
        const descriptionHash = await node.add({
          content: data?.data?.description,
        });
        const previewBuffer = Buffer.from(
          data?.data?.previewPath.split(",")[1],
          "base64"
        );
        const preview = await Jimp.read(previewBuffer);
        await preview.resize(720, 404).quality(95);
        const previewContent = await preview.getBufferAsync(preview.getMIME());
        const previewHash = await node.add({
          content: previewContent,
        });

        const userDetails = await db.get("userDetailsDrive");

        const body = {
          name: data?.data?.title,
          cate_id: data?.data?.category,
          type_id: data?.data?.type,
          user_id: userDetails?.userId,
          tags: data?.data?.tags,
          status_id: 1,
          info: {
            content_hash: data?.fileHash,
            description: String(descriptionHash.cid),
            txhash: data?.transactionHash,
            file_name: data?.data?.fileName,
            public_hash: data?.publicHash,
            ext: data?.data?.ext,
            size: data?.size,
            thumbnail: String(previewHash.cid),
          },
        };

        // upload to server
        await fetch(`${SERVER_URL}/content/create`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        mainWindow.webContents.send("is-registering-file", false);
      }
    }
  };
}

export default connectToWS;
