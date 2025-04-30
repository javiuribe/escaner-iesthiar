# escaner-iesthiar

# Descarga de Ezconfig

El escáner debe configurarse para que tenga un prefijo específico y debe tener un formato que permita separar los campos con punto y coma ";". Para ello, hay un fichero llamado config-escaner.exm que se puede importar en el escáner. Esto se debe hacer con el software Ezconfig.

La última versión de EZConfig disponible para el público en general:

Versión 4.X.X basada en navegador HTML para configurar los escáneres Honeywell de las generaciones 6 y 7.
Esta versión es compatible con MS Edge, Google Chrome, Internet Explorer y Firefox.
La aplicación EZConfig para escaneo basada en navegador más reciente, versión 4.5.57 con fecha de septiembre de 2023,
se puede descargar desde la página de descargas de software de Honeywell en: https://hsmftp.honeywell.com/
Software > Barcode Scanners > Software > Tools and Utilities > EZConfig for Scanning > Current.

## Salida de Datos del Escáner

El escáner está configurado para devolver los datos leídos con el siguiente formato según el escáner:

```
Aseos1:<CODIGO_DE_BARRAS>
Entrada1:<CODIGO_DE_BARRAS>
```

Donde:

- `Aseos1` es el prefijo configurado en el escáner.
- `<CODIGO_DE_BARRAS>` es el contenido del código de barras escaneado.

## Configuración del Prefijo

Para configurar el prefijo "aseo1" en el escáner, se han seguido estos pasos:

1. **Uso de EZConfig**: Se ha utilizado la herramienta EZConfig de Honeywell para establecer el prefijo. Es una página web que se debe lanzar con el comando de chrome y opciones para acceder a ficheros. Ejemplo: "C:\Program Files\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files  
2. **Configuración del prefijo**: Se establece el prefijo deseado. Ejemplo "Aseos1:".
3. **Guardado**: Se guarda la configuración en el dispositivo.


# Configuración del Programa Escáner IES Thiar
En el fichero config.json se configuran los siguientes aspectos:

- filename: Nombre del fichero donde se almacenan los códigos de barras. Por defecto, "aseos.json".
- path: Ruta donde se almacenará el fichero. Por defecto, "ruta_actual/databases".
- lectorAseos: Prefijo asignado al escáner dedicado a las entradas al aseo.
- lectorEntrada: Prefijo asignado al escáner dedicado a las entradas tardías.

# Generación de ejecutables
El siguiente comando genera ejecuables para Windows 64 bits, Linux 64 bits y Raspberry Pi 64 bits
```
node build
```
Este comando ejecutará los siguientes pasos:

1. Instala las dependencias necesarias (npm install).

2. Genera los ejecutables para 3 sistemas operativos diferentes en la carpeta dist/:

- escaner-win32-x64 para Windows.

- escaner-linux-x64 para Linux.

- escaner-linux-arm64 para Raspberry Pi

Nota: si se desea generar únicamente ejecutable para raspberry pi ejecutar el siguiente comando:

```
node build raspberry
```