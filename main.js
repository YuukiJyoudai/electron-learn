const { app, BrowserWindow, Menu, MenuItem, ipcMain, nativeTheme, globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 默认为true，为了安全；因为Node可以读取用户本地的文件
      contextIsolation: true
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()

  // 快捷键
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Electron',
    submenu: [
      {
        role: 'help',
        accelerator: 'Cmd+Shift+I',
        click: () => {
          console.log('Electron rocks!')
        }
      }
    ]
  }))
  Menu.setApplicationMenu(menu)
  // ipc通信
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
  ipcMain.handle('my-command', () => {
    console.log('intersting')
  })
}

// 主进程控制
app.whenReady().then(() => {
  createWindow()
  globalShortcut.register('Cmd+Shift+K', () => {
    console.log('global key click')
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * 注册协议
 * 
 * 我们下面的案例：指定了我们的协议名为——electron-fiddle://
 */
// if (process.defaultApp) {
//   if (process.argv.length >= 2) {
//     app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [
//       path.resolve(process.argv[1])
//     ])
//   }
// } else {
//   app.setAsDefaultProtocolClient('electron-fiddle')
// }
// 处理协议，弹出一个错误的对话框
// app.on('open-url', (event, url) => {
//   dialog.showErrorBox('欢迎回来', `导向至${url}`)
// })

// 拖拽文件
const iconName = path.join(__dirname, 'iconDrag.png')

fs.writeFileSync(path.join(__dirname, 'drag-test.md'), 'first drag')

ipcMain.on('ondragstart', (event, filePath) => {
  console.log('drag filePath', filePath)
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName
  })
})
