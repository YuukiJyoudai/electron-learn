const { contextBridge, ipcRenderer } = require('electron')
const Mousetrap = require('mousetrap')

Mousetrap.bind('command+shift+c', () => {
  console.log('command + shift + c')
})

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})
