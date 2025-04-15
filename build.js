const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  `npx electron-packager . ${appName} --platform=win32 --arch=x64 --out=dist --overwrite`,
  `npx electron-packager . ${appName} --platform=linux --arch=x64 --out=dist --overwrite`,
  `npx electron-packager . ${appName} --platform=linux --arch=armv7l --out=dist --overwrite`,
];

// Ejecutar los comandos uno por uno
commands.forEach((cmd, index) => {
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
