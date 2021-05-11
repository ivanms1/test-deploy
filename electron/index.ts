import { app, BrowserWindow } from "electron";
import Ctl from "ipfsd-ctl";
import fs from "fs";
import path from "path";
import Protector from "libp2p/src/pnet";
import isDev from "electron-is-dev";
import serve from "electron-serve";

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

  try {
    const ipfsd = await Ctl.createController({
      ipfsHttpModule: require("ipfs-http-client"),
      ipfsBin: require("go-ipfs").path(),
      remote: false,
      disposable: false,
      test: false,
      ipfsOptions: {
        libp2p: {
          modules: {
            connProtector: new Protector(
              fs.readFileSync(__dirname + "/assets/swarm.key")
            ),
          },
        },
        config: {
          Bootstrap: [BOOTSTRAP_ADDRESSS],
        },
      },
    });

    await ipfsd.init();

    await ipfsd.start();

    await prepareDb();

    const id = await ipfsd.api.id();

    const peers = await ipfsd.api.swarm.peers();

    logger("ipfs-id", id);

    logger("peers", peers);

    node = ipfsd.api;

    if (isDev) {
      await mainWindow.loadURL("http://localhost:1235");
      mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
      await loadURL(mainWindow);
    }
  } catch (err) {
    console.log(`err`, err);
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
