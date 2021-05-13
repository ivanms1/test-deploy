import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import IPFS from "ipfs-core";
import Protector from "libp2p/src/pnet";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import PeerId from "peer-id";

import { prepareDb } from "./store/db";
import connectToWS from "./socket";
import logger from "./logger";

import "./ipcMain";

const loadURL = serve({ directory: "dist/parcel-build" });

export let node;

export let mainWindow: BrowserWindow | null = null;

connectToWS();

const BOOTSTRAP_ADDRESSS =
  "/ip4/52.79.200.55/tcp/4001/ipfs/12D3KooWFyYb19Xki7pj4PyQ1jnZsEx4MfExyng2MZCAtpPXoCxb";

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

  logger("swarm-key", fs.readFileSync(__dirname + "/assets/swarm.key"));

  try {
    const privateKey = await PeerId.create({ keyType: "Ed25519" });

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
      init: { privateKey },
    });

    await prepareDb();

    const id = await node.id();
    const peers = await node.swarm.peers();

    logger("ipfs-id", id);
    logger("ipfs-peers", peers);

    logger("ipfs-id", id);

    if (isDev) {
      await mainWindow.loadURL("http://localhost:1235");
      mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
      await loadURL(mainWindow);
    }
  } catch (err) {
    logger("ipfs-connection", err);
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("uncaughtException", (uncaughtException) => {
  logger("uncaught-exception", uncaughtException);
});
