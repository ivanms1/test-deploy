import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import IPFS from "ipfs-core";
import Jimp from "jimp";
import fetch from "electron-fetch";
import Protector from "libp2p/src/pnet";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import db, { prepareDb } from "./store/db";

import { DRIVE_SERVER } from "./const";

import "./ipcMain";

const loadURL = serve({ directory: "dist/parcel-build" });

export let node;

export let mainWindow: BrowserWindow | null = null;

const MANAGER_PORT = 174012;

export const client = new W3CWebSocket(`ws://127.0.0.1:${MANAGER_PORT}`);

client.onopen = () => {
  console.log("WebSocket Client Connected");
};

const BOOTSTRAP_ADDRESSS =
  "/ip4/52.79.200.55/tcp/4001/ipfs/12D3KooWFyYb19Xki7pj4PyQ1jnZsEx4MfExyng2MZCAtpPXoCxb";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async (): Promise<void> => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    title: "Conun Drive",
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, "preload.js"),
      webSecurity: false,
    },
    resizable: false,
  });

  mainWindow.removeMenu();
  mainWindow.setResizable(false);

  try {
    node = await IPFS.create({
      libp2p: {
        modules: {
          connProtector: new Protector(
            fs.readFileSync(__dirname + "/assets/swarm.key")
          ),
        },
      },
      // @ts-expect-error
      config: {
        Bootstrap: [BOOTSTRAP_ADDRESSS],
      },
    });

    await prepareDb();

    if (isDev) {
      await mainWindow.loadURL("http://localhost:1235");
      mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
      await loadURL(mainWindow);
    }
  } catch (err) {
    console.log(`err`, err);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

client.onmessage = async (message) => {
  if (typeof message.data === "string") {
    const data = JSON.parse(message?.data);
    console.log(`data`, data);
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
      await fetch(`${DRIVE_SERVER}/content/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      mainWindow.webContents.send("is-registering-file", false);
    }
  }
};
