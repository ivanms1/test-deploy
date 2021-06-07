import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getFilePreview: (hash: string) =>
    ipcRenderer.invoke("get-file-preview", hash),
  getFileDescription: (hash: string) =>
    ipcRenderer.invoke("get-file-description", hash),
  downloadFile: (hash: string) => ipcRenderer.invoke("download-file", hash),
  uploadFile: (info: any) => ipcRenderer.invoke("upload-file", info),
  likeContent: (args: any) => ipcRenderer.invoke("like-content", args),
  getCurrentUser: () => ipcRenderer.invoke("get-current-user"),
  getLaterList: () => ipcRenderer.invoke("get-later-list"),
  updateLaterList: (list: any) => ipcRenderer.invoke("update-later-list", list),
  listenToFileRegister: (fn: any) => {
    ipcRenderer.on("is-registering-file", (e, ...args) => fn(...args));
  },
  uploadAvatar: (path: string) => ipcRenderer.invoke("upload-avatar", path),
  createQRCode: (args: any) => ipcRenderer.invoke("create-qr-code", args),
  readQRCode: (args: any) => ipcRenderer.invoke("read-qr-code", args),
  listenToIsManagerConnected: (fn: any) => {
    ipcRenderer.on("is-manager-connected", (e, ...args) => fn(...args));
  },
  connectToManager: () => ipcRenderer.invoke("connect-to-manager"),
  listenToDownloadSuccess: (fn: any) => {
    ipcRenderer.on("download-success", (e, ...args) => fn(...args));
  },
  listenToUploadSuccess: (fn: any) => {
    ipcRenderer.on("upload-success", (e, ...args) => fn(...args));
  },
  listenToDownloadStart: (fn: any) => {
    ipcRenderer.on("download-start", (e, ...args) => fn(...args));
  },
  listenToError: (fn: any) => {
    ipcRenderer.on("error-listener", (e, ...args) => fn(...args));
  },
  listenToDownloadProgress: (fn: any) => {
    ipcRenderer.on("download-percentage", (e, ...args) => fn(...args));
  },
  listenToUploadProgress: (fn: any) => {
    ipcRenderer.on("upload-percentage", (e, ...args) => fn(...args));
  },
  listenToDeepLink: (fn: any) => {
    ipcRenderer.on("send-share-link", (e, ...args) => fn(...args));
  },
  listenToUpdateManager: (fn: any) => {
    ipcRenderer.on("update-manager", (e, ...args) => fn(...args));
  },
  removeListeners: (name: string) => ipcRenderer.removeAllListeners(name),
  openFile: (path: string) => ipcRenderer.invoke("open-file", path),
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getPeers: () => ipcRenderer.invoke("get-peers"),
  getShareLink: () => ipcRenderer.invoke("get-share-link"),
});
