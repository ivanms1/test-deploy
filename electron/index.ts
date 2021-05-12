import { app, BrowserWindow } from "electron";
import Ctl from "ipfsd-ctl";
import path from "path";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import copyfiles from "copyfiles";

import db, { prepareDb } from "./store/db";
import connectToWS from "./socket";
import logger from "./logger";

import "./ipcMain";
import getIpfsBinPath from "./helpers/getIpfsBinPath";
import writeIpfsBinaryPath from "./helpers/writeIpfsBinaryPath";

const loadURL = serve({ directory: "dist/parcel-build" });

export let ipfsd = null;

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
    await prepareDb();
    const ipfsBin = getIpfsBinPath();
    writeIpfsBinaryPath(ipfsBin);

    const ipfsPath = await db.get("ipfs-path");

    ipfsd = await Ctl.createController({
      ipfsHttpModule: require("ipfs-http-client"),
      type: "go",
      ipfsBin: ipfsBin,
      ipfsOptions: {
        repo: ipfsPath?.path ?? "",
      },
      remote: false,
      disposable: false,
      test: false,
      args: ["--migrate", "--enable-gc", "--routing", "dhtclient"],
    });

    copyfiles(
      [__dirname + "/assets/swarm.key", ipfsd.path],
      { up: true, error: true },
      (err) => {
        console.log(`err`, err);
      }
    );

    if (!ipfsPath?.path) {
      await db.put({
        ...ipfsPath,
        path: ipfsd.path,
      });
    }

    await ipfsd.init();

    await ipfsd.start();

    node = ipfsd.api;

    const id = await ipfsd.api.id();

    await ipfsd.api.bootstrap.clear();

    await ipfsd.api.bootstrap.add(BOOTSTRAP_ADDRESSS);

    const peers = await ipfsd.api.swarm.peers();

    logger("ipfs-id", id);

    logger("peers", peers);

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

app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    if (ipfsd) {
      await ipfsd.stop();
    }
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
