const { exec } = require('child_process');

const appName = 'escaner';

// Comandos para instalar dependencias y luego empaquetar
const commands = [
  'npm install', // Instalar las dependencias
  `electron-packager . ${appName} --platform=win32 --arch=x64 --out=dist --overwrite`, // Windows 64-bit
  `electron-packager . ${appName} --platform=linux --arch=x64 --out=dist --overwrite` // Linux 64-bit
];

// Ejecutar los comandos secuencialmente
commands.forEach((cmd, index) => {
  console.log(`Ejecutando: ${cmd}`);
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando #${index + 1}:\n${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
