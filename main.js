// Modules to control application life and create native browser window
const {
  app,
  powerSaveBlocker,
  BrowserWindow,
  Menu,
  Tray,
  autoUpdater,
  dialog
} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
app.mainWindow;
const windowWidth = 375;
const windowHeight = 350;

app.powerSaverId = powerSaveBlocker.start('prevent-app-suspension');

function createWindow() {
  // Create the browser window.
  app.mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    alwaysOnTop: true,
    backgroundColor: '#EB5757',
    titleBarStyle: 'hidden',
    width: windowWidth,
    maxWidth: windowWidth,
    minWidth: windowWidth,
    height: windowHeight,
    maxHeight: windowHeight,
    minHeight: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  app.mainWindow.loadFile('index.html');

  // Open the DevTools.
  // app.mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  app.mainWindow.on('close', function(event) {
    /* // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.mainWindow = null; */
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      if (!app.isQuitting) {
        event.preventDefault();
        app.mainWindow.hide();
      }
    }

    return false;
  });

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        /*          {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator:
            process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        },
 */ {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
    }
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    });
    // Edit menu.
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    );
    // Window menu.
    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.tray = new Tray(path.join(__dirname, 'assets/images/tray_red.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function() {
        app.mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function() {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  // Make a change to the context menu
  contextMenu.items[1].checked = false;

  // Call this again for Linux because we modified the context menu
  app.tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', function() {
  app.mainWindow.destroy();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (app.mainWindow === null) createWindow();
  else app.mainWindow.show();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const server = 'https://pamidor-hazel.dvd.now.sh';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed);
autoUpdater.checkForUpdates();

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  console.log('Update downloaded');
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts, response => {
    if (response === 0) {
      app.isQuitting = true;
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application');
  console.error(message);
});
