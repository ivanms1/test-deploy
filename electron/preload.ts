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
  listenToFileRegister: (fn: any) => {
    ipcRenderer.on("is-registering-file", (e, ...args) => fn(...args));
  },
  uploadAvatar: (path: string) => ipcRenderer.invoke("upload-avatar", path),
});
