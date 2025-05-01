// file: preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  addTile: (url) => ipcRenderer.invoke("add-tile", url),
  changeTileURL: (index, url) =>
    ipcRenderer.invoke("change-tile-url", index, url),
});
