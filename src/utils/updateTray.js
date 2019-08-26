const app = require('electron').remote.app;
const Menu = require('electron').remote.Menu;
const nativeImage = require('electron').remote.nativeImage;
const path = require('path');

function getCompletedPomodorosMessage(completed) {
  const pomodoros = Math.floor(completed / 2);
  return pomodoros === 1
    ? `${pomodoros} completed pomodoro`
    : `${pomodoros} completed pomodoros`;
}

function setMenuCompletedPomodoros(completedTimer) {
  const completedText = getCompletedPomodorosMessage(completedTimer);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: completedText,
      click: function() {}
    },
    {
      label: 'Show App',
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  app.tray.setContextMenu(contextMenu);
}

function updateTray(isWorkPeriod, textTimer) {
  //setMenu(getCompletedPomodorosMessage(completedTimer));
  const imagePath = isWorkPeriod
    ? path.join(__dirname, '..', '..', 'assets/images/tray_red.png')
    : path.join(__dirname, '..', '..', 'assets/images/tray_green.png');
  app.tray.setImage(nativeImage.createFromPath(imagePath));
  app.tray.setToolTip(textTimer);
}

module.exports = { updateTray, setMenuCompletedPomodoros };
