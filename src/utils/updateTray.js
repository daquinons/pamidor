const app = require('electron').remote.app;
const Menu = require('electron').remote.Menu;
const nativeImage = require('electron').remote.nativeImage;
const path = require('path');

function getCompletedPomodorosMessage(completed) {
  const pomodoros = Math.floor(completed / 2);
  return pomodoros === 1
    ? `${pomodoros} Completed Pomodoro`
    : `${pomodoros} Completed Pomodoros`;
}

function setMenuCompletedPomodoros(completedTimer) {
  const completedText = getCompletedPomodorosMessage(completedTimer);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: completedText,
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
  app.tray.setContextMenu(contextMenu);
}

function updateTray(isWorkPeriod, textTimer) {
  const imagePath = isWorkPeriod
    ? path.join(__dirname, '..', '..', 'assets/images/tray_red.png')
    : path.join(__dirname, '..', '..', 'assets/images/tray_green.png');
  app.tray.setImage(nativeImage.createFromPath(imagePath));
  app.tray.setToolTip(textTimer);
}

module.exports = { updateTray, setMenuCompletedPomodoros };
