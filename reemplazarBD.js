document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const btnReemplazar = document.getElementById("btnReemplazarBD");
  btnReemplazar.addEventListener("click", () => {
    fileInput.click(); // Abrir selector de archivos
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.json')) {
      alert("Selecciona un archivo .json válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const contenido = e.target.result;

      try {
        // Validar JSON
        JSON.parse(contenido);
      } catch (err) {
        alert("El archivo no contiene un JSON válido.");
        return;
      }

      const rutaDestino = path.join(__dirname, config.path, config.filename);

      fs.writeFile(rutaDestino, contenido, (err) => {
        if (err) {
          console.error("Error al sobrescribir el archivo:", err);
          alert("Error al reemplazar la base de datos.");
        } else {
          alert("Base de datos reemplazada correctamente.");
        }
      });
    };

    reader.readAsText(file);
  });
});
