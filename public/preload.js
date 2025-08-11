import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // Add more APIs as needed
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // System info
  isElectron: true,
  platform: process.platform
});

// Remove node integration from window
delete window.module;
delete window.exports;
delete window.require;