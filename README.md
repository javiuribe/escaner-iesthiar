# escaner-iesthiar

# Configuración del Escáner Honeywell

Este documento describe la configuración del escáner Honeywell para que los datos escaneados incluyan un prefijo específico.

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
2. **Configuración del prefijo**: Se establece el prefijo deseado. Ejemplo "Aseo1:".
3. **Guardado**: Se guarda la configuración en el dispositivo.

## Compatibilidad

Este escáner funcionará con cualquier sistema que acepte entrada de teclado, como:

- Aplicaciones de escritorio.
- Formularios web.
- Software de gestión.

Si necesitas modificar el prefijo o restaurar la configuración de fábrica, utiliza la herramienta EZConfig.

# Configuración del Programa
En el fichero config.json se configuran los siguientes aspectos:

- filename: Nombre del fichero donde se almacenan los códigos de barras. Por defecto, "aseos.json".
- path: Ruta donde se almacenará el fichero. Por defecto, "ruta_actual/databases".
- lectorAseos: Prefijo asignado al escáner dedicado a las entradas al aseo.
- lectorEntrada: Prefijo asignado al escáner dedicado a las entradas tardías.

