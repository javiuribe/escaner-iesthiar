const fs = require('fs');
const path = require('path');

// Cargar configuración
const config = require('./config.json');

// Asegurarse de que exista la carpeta de destino
const fullPath = path.join(__dirname, config.path);
if (!fs.existsSync(fullPath)) {
  fs.mkdirSync(fullPath, { recursive: true });
}

let inputBuffer = [];

document.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const fullInput = inputBuffer.join('').trim();
    const [location, barcode] = fullInput.split(':');

    if (location && barcode) {
      const timestamp = new Date().toISOString();

      // Dividir el barcode en partes
      const partes = barcode.split(';');
      const codigoAlumno = partes[0]?.trim() || 'Desconocido';
      const nombreCompleto = `${partes[1]?.trim() || ''} ${partes[2]?.trim() || ''}`.trim() || 'Desconocido';
      const curso = partes[3]?.trim() || 'Desconocido';

      // Mostrar en pantalla
      const tableBody = document.querySelector('#barcode-table tbody');
      const row = document.createElement('tr');

      const cellLocation = document.createElement('td');
      cellLocation.textContent = location;

      const cellCodigo = document.createElement('td');
      cellCodigo.textContent = codigoAlumno;

      const cellNombre = document.createElement('td');
      cellNombre.textContent = nombreCompleto;

      const cellCurso = document.createElement('td');
      cellCurso.textContent = curso;

      const dateObj = new Date(timestamp);
      const cellDate = document.createElement('td');
      cellDate.textContent = dateObj.toLocaleDateString();

      const cellTime = document.createElement('td');
      cellTime.textContent = dateObj.toLocaleTimeString();

      row.appendChild(cellLocation);
      row.appendChild(cellCodigo);
      row.appendChild(cellNombre);
      row.appendChild(cellCurso);
      row.appendChild(cellDate);
      row.appendChild(cellTime);

      tableBody.appendChild(row);

      guardarCodigoEnArchivo(location, codigoAlumno, nombreCompleto, curso, timestamp);
    }

    inputBuffer = [];
  } else {
    inputBuffer.push(event.key);
  }
});

// Guardar datos en archivo JSON
function guardarCodigoEnArchivo(location, nia, nombreCompleto, curso, timestamp) {
  const filePath = path.join(__dirname, config.path, config.filename);
  let data = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content) {
      try {
        data = JSON.parse(content);
      } catch (err) {
        console.error('Error al parsear JSON:', err);
      }
    }
  }

  data.push({ location, nia, nombreCompleto, curso, timestamp });

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Guardado en ${filePath}`);
  } catch (err) {
    console.error('Error al escribir en el archivo:', err);
  }
}
