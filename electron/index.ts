import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import IPFS from "ipfs-core";
import Protector from "libp2p/src/pnet";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import { autoUpdater } from "electron-updater";

import { prepareDb } from "./store/db";
import connectToWS from "./socket";

import "./ipcMain";

const loadURL = serve({ directory: "dist/parcel-build" });

export let node;

export let mainWindow: BrowserWindow | null = null;

autoUpdater.checkForUpdatesAndNotify();

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
