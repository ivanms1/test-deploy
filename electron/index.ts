import { app, BrowserWindow, shell, nativeImage, Menu, Tray } from "electron";
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
import "./ipcMain/server";

const loadURL = serve({ directory: "dist/parcel-build" });

const PROTOCOL_PREFIX = "conun-drive://";

const APP_HEIGHT = process.platform === "win32" ? 746 : 720;

export let mainWindow: BrowserWindow | null = null;

let tray = null;

connectToWS();

function createTray() {
  const icon = path.join(__dirname, "/assets/icon.png"); // required.
  const trayicon = nativeImage.createFromPath(icon);
  tray = new Tray(trayicon.resize({ width: 24 }));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Drive",
      click: () => {
        /* eslint-disable */
        if (!mainWindow) {
          createWindow();
        } else {
          mainWindow.restore();
        }
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit(); // actually quit the app.
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

const createWindow = async (): Promise<void> => {
  try {
    await prepareDb();

    await createIpfs();

    if (!tray) {
      createTray();
    }

    mainWindow = new BrowserWindow({
      height: APP_HEIGHT,
      width: 1280,
      minHeight: APP_HEIGHT,
      minWidth: 1080,
      title: "Conun Drive",
      webPreferences: {
        nodeIntegration: false,
        preload: path.resolve(__dirname, "preload.js"),
      },
    });

    mainWindow.removeMenu();

    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        /* eslint-disable @typescript-eslint/no-var-requires */
      } = require("electron-devtools-installer");
      await installExtension(REACT_DEVELOPER_TOOLS);
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
  mainWindow = null;
  if (process.platform === "darwin") {
    app.dock.hide();
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
    if (!mainWindow) {
      createWindow();
    } else {
      mainWindow.restore();
    }
    logger("Push to file:", `Instance lock triggered`, "info");
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
