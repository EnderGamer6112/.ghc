const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveGhc: (data) => ipcRenderer.invoke('save-ghc', data),
  loadGhc: () => ipcRenderer.invoke('load-ghc')
});
