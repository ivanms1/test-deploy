import { app, BrowserWindow } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import serve from "electron-serve";

import { prepareDb } from "./store/db";
import { createIpfs } from "./ipfs";
import connectToWS from "./socket";
import logger from "./logger";

import "./ipcMain";

const loadURL = serve({ directory: "dist/parcel-build" });

export let mainWindow: BrowserWindow | null = null;

connectToWS();

const createWindow = async (): Promise<void> => {
  try {
    await prepareDb();

    await createIpfs();

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

    if (isDev) {
      await mainWindow.loadURL("http://localhost:1235");
      mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
      await loadURL(mainWindow);
    }
  } catch (err) {
    logger("app-init", err, "error");
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
  logger("uncaught-exception", uncaughtException, "error");
});
