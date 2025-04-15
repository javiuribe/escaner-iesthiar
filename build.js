const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const iconWindows = './img/icono-windows.ico';
const iconLinux = './img/icono-linux.png';
const appName = 'escaner';
const distPath = path.join(__dirname, 'dist');

// Asegúrate de que la carpeta dist existe
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
  console.log('📁 Carpeta dist creada');
}

// Comandos para empaquetar
const commands = [
  'npm install',
  `npx electron-packager . ${appName} --platform=win32 --arch=x64 --out=dist --overwrite --icon=${iconWindows}`,
  `npx electron-packager . ${appName} --platform=linux --arch=x64 --out=dist --overwrite --icon=${iconLinux}`,
  `npx electron-packager . ${appName} --platform=linux --arch=armv7l --out=dist --overwrite --icon=${iconLinux}`,
];

// Verificar si se pasó el argumento 'raspberry'
const isRaspberry = process.argv.includes('raspberry');

// Ejecutar los comandos correspondientes
const commandsToExecute = isRaspberry ? [commands[0], commands[3]] : commands;

commandsToExecute.forEach((cmd, index) => {
  console.log(`🚀 Ejecutando: ${cmd}`);
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error al ejecutar el comando #${index + 1}:\n${error.message}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
