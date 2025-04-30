document.addEventListener("DOMContentLoaded", async () => {
  const formBusqueda = document.getElementById("filtro-busqueda");
  const tablaBusqueda = document.getElementById("tabla-busqueda");
  const mensaje = document.getElementById("mensaje");
  const escannerSelect = document.getElementById("escanner");

  const config = await fetch('./config.json').then(response => response.json());
  const lectores = [config.lectorAseos, config.lectorEntrada];

  lectores.forEach(lector => {
    const option = document.createElement("option");
    option.value = lector;
    option.textContent = lector;
    escannerSelect.appendChild(option);
  });

  escannerSelect.value = config.lectorAseos;
  let nombreAlumnoInforme = 'Alumno';

  const fechaInicioInput = document.getElementById("fechaInicio");
  const fechaFinInput = document.getElementById("fechaFin");

  const formatoFecha = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  fechaInicioInput.value = formatoFecha(primerDiaMes);
  fechaFinInput.value = formatoFecha(ultimoDiaMes);

  async function cargarDatos() {
    try {
      const response = await fetch(`${config.path}/${config.filename}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  async function buscarRegistros() {
    const nia = document.getElementById("barcode").value.trim();
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;
    const escannerSeleccionado = escannerSelect.value;

    if (!nia || !fechaInicio || !fechaFin) {
      mensaje.textContent = "Por favor, completa todos los campos.";
      return;
    }

    mensaje.textContent = "";

    const datos = await cargarDatos();

    const registrosFiltrados = datos.filter(entry => {
      const fecha = entry.timestamp.split("T")[0];
      let coincideNia;
      if (isNaN(nia)) {
        const nombre = nia.toUpperCase();
        coincideNia = entry.nombreCompleto.toUpperCase().includes(nombre);
      } else {
        coincideNia = entry.nia === nia;
      }

      const enRango = fecha >= fechaInicio && fecha <= fechaFin;
      const coincideEscanner = escannerSeleccionado === "Todos" || entry.location === escannerSeleccionado;

      return coincideNia && enRango && coincideEscanner;
    });

    registrosFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (registrosFiltrados.length > 0) {
      tablaBusqueda.innerHTML = "";
      nombreInforme = registrosFiltrados[0].nombreCompleto || 'Alumno';
      registrosFiltrados.forEach(entry => {
        const row = document.createElement("tr");
        const date = new Date(entry.timestamp);
        row.innerHTML = `
          <td>${entry.location}</td>
          <td>${entry.nia}</td>
          <td>${entry.nombreCompleto || 'Desconocido'}</td>
          <td>${entry.curso || 'Desconocido'}</td>
          <td>${entry.estado || ''}</td>
          <td>${date.toLocaleDateString()}</td>
          <td>${date.toLocaleTimeString()}</td>
        `;
        tablaBusqueda.appendChild(row);
      });
    } else {
      tablaBusqueda.innerHTML = "";
      mensaje.textContent = "No se encontraron registros para este alumno en el rango de fechas.";
    }
  }

  formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarRegistros();
  });

  // Función para generar PDF de la tabla de búsqueda con rango de fechas en el título
  document.getElementById("generar-pdf-busqueda").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fechaInicio = new Date(fechaInicioInput.value).toLocaleDateString();
    const fechaFin = new Date(fechaFinInput.value).toLocaleDateString();
    const niaInput = document.getElementById("barcode").value.trim() || 'Alumno';

    doc.setFontSize(16);
    doc.text(`Historial del escáner ${escannerSelect.value} del alumno ${nombreInforme}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`De ${fechaInicio} a ${fechaFin}`, 14, 26);

    const tabla = document.getElementById("tabla-busqueda");

    if (!tabla || tabla.rows.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ["Escáner", "NIA", "Nombre completo", "Curso", "Estado", "Fecha", "Hora"];

    doc.autoTable({
      head: [headers],
      body: Array.from(tabla.rows).map(row => Array.from(row.cells).map(cell => cell.textContent)),
      startY: 35,
      styles: { halign: 'center' },
      headStyles: { fillColor: [40, 167, 69] },
      margin: { top: 10 }
    });
      
    const nombreArchivo = `Informe_${niaInput}_${fechaInicio}_${fechaFin}.pdf`;
    doc.save(nombreArchivo);
  });
});
