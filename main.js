const { app, BrowserWindow } = require('electron');

function createWindow() {
  const isRaspberry = process.arch.startsWith('arm');

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    focusable: true,
    fullscreenable: true,
    kiosk: isRaspberry,
    //autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
