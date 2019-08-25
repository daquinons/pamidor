const electronInstaller = require('electron-winstaller');

const start = async () => {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './release-builds/pamidor-win32-ia32',
      outputDirectory: './release-builds/installer-win',
      authors: 'David Quiñones',
      exe: 'pamidor.exe'
    });
    console.log('It generated the installer!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
};

start();
