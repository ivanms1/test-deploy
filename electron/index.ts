import { app, BrowserWindow, shell } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import serve from "electron-serve";

import { prepareDb } from "./store/db";
import { createIpfs } from "./ipfs";
import connectToWS from "./socket";
import logger from "./logger";

import { getURLFromArgv } from "./helpers";

import "./ipcMain";
import "./ipcMain/app";

const loadURL = serve({ directory: "dist/parcel-build" });
const PROTOCOL_PREFIX = "conun-drive://";

const APP_HEIGHT = process.platform === "win32" ? 746 : 720;

export let mainWindow: BrowserWindow | null = null;

connectToWS();

const createWindow = async (): Promise<void> => {
  try {
    await prepareDb();

    await createIpfs();

    mainWindow = new BrowserWindow({
      height: APP_HEIGHT,
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

    if (process.platform !== "darwin") {
      if (
        process.argv.length > 1 &&
        process.argv[1].startsWith(PROTOCOL_PREFIX)
      ) {
        // This line works for win and lin
        getURLFromArgv(process.argv[1]).then((url: string) => {
          logger("start-up-with-link", `Start up with link: ${url}`, "error");
          if (url) {
            mainWindow.webContents.send("send-share-link", {
              targetLink: url,
            });
          }
        });
      }
    }
  } catch (err) {
    logger("app-init", err, "error");
  }

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const singleInstanceLock = app.requestSingleInstanceLock();
app.on("ready", () => {
  createWindow();
});

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

app.setAsDefaultProtocolClient("conun-drive");

if (!singleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", (_, argv) => {
    logger("Push to file:", `Instance lock triggered`, "error");
    if (argv.length > 1) {
      // Only try this if there is an argv (might be redundant)

      if (process.platform == "win32") {
        getURLFromArgv(argv[argv.length - 1]).then((url: string) => {
          if (url) {
            mainWindow.webContents.send("send-share-link", {
              targetLink: url,
            });
          }
        });
      } else if (process.platform == "linux") {
        getURLFromArgv(argv[1]).then((url: string) => {
          if (url) {
            mainWindow.webContents.send("send-share-link", {
              targetLink: url,
            });
          }
        });
      }
    }
  });
}
// For mac
app.on("will-finish-launching", () => {
  app.on("open-url", (event, url) => {
    event.preventDefault();
    logger("OPEN-URL:", url, "error");
    getURLFromArgv(url).then((url: string) => {
      if (url) {
        mainWindow.webContents.send("send-share-link", {
          targetLink: url,
        });
      }
    });
  });
});

// for mac, when open already
app.on("open-url", (event, url) => {
  event.preventDefault();
  logger("OPEN-URL:", url, "error");
  getURLFromArgv(url).then((url: string) => {
    if (url) {
      mainWindow.webContents.send("send-share-link", {
        targetLink: url,
      });
    }
  });
});

process.on("uncaughtException", (uncaughtException) => {
  logger("uncaught-exception", uncaughtException, "error");
});
