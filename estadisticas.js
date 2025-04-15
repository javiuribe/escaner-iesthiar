const path = require('path');

document.addEventListener("DOMContentLoaded", () => {
  const formFiltro = document.getElementById("filtro-fechas");
  const tablaEstadisticas = document.getElementById("tabla-estadisticas");
  const mensaje = document.getElementById("mensaje");

  const config = require('./config.json');
  const lectorAseos = config.lectorAseos;
  const lectorEntrada = config.lectorEntrada;

  const formatoFecha = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fechaInicioInput = document.getElementById("fechaInicio");
  const fechaFinInput = document.getElementById("fechaFin");

  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  fechaInicioInput.value = formatoFecha(primerDiaMes);
  fechaFinInput.value = formatoFecha(ultimoDiaMes);

  async function cargarDatos() {
    try {
      const filePath = path.join(__dirname, config.path, config.filename);
      const response = await fetch(filePath);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  async function filtrarYContar() {
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    if (!fechaInicio || !fechaFin) {
      mensaje.textContent = "Por favor, selecciona ambas fechas.";
      return;
    }

    mensaje.textContent = "";
    const datos = await cargarDatos();

    const datosFiltrados = datos.filter(entry => {
      const fecha = entry.timestamp.split("T")[0];
      return (
        fecha >= fechaInicio &&
        fecha <= fechaFin
      );
    });

    const contadorAseo = {};
    const contadorEntrada = {};
    const nombres = {};
    const cursos = {};

    datosFiltrados.forEach(entry => {
      const nia = entry.nia || 'Desconocido';
      const nombre = entry.nombreCompleto || 'Desconocido';
      const curso = entry.curso || 'Desconocido';

      if (entry.location === lectorAseos) {
        contadorAseo[nia] = (contadorAseo[nia] || 0) + 1;
      }

      if (entry.location === lectorEntrada) {
        contadorEntrada[nia] = (contadorEntrada[nia] || 0) + 1;
      }

      nombres[nia] = nombre;
      cursos[nia] = curso;
    });

    const resultadosOrdenados = Object.entries(contadorAseo).sort((a, b) => b[1] - a[1]);

    if (resultadosOrdenados.length > 0) {
      tablaEstadisticas.innerHTML = "";
      resultadosOrdenados.forEach(([nia, veces]) => {
        const nombre = nombres[nia];
        const curso = cursos[nia];
        const frecuenciaEntrada = contadorEntrada[nia] || 0;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nia}</td>
          <td>${nombre}</td>
          <td>${curso}</td>
          <td>${veces}</td>
          <td>${frecuenciaEntrada}</td>
        `;
        tablaEstadisticas.appendChild(row);
      });
    } else {
      tablaEstadisticas.innerHTML = "";
      mensaje.textContent = "No se encontraron resultados para este rango de fechas.";
    }
  }

  formFiltro.addEventListener("submit", (e) => {
    e.preventDefault();
    filtrarYContar();
  });

  document.getElementById("btnGenerarPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    // Cargar imagen
    const img = new Image();
    img.src = "./img/logo-thiar.jpg"; // Ruta relativa correcta

    img.onload = function () {
      doc.addImage(img, "JPEG", 14, 10, 40, 25); // x, y, width, height

      doc.setFontSize(18);
      doc.text("Informe de frecuencias al aseo y entrada", 14, 50);
      doc.setFontSize(12);
      doc.text(`Del ${fechaInicio} al ${fechaFin}`, 14, 58);

      const headers = [["NIA", "Nombre completo", "Curso", "Frecuencias aseo", "Frecuencias entrada"]];
      const data = [];

      document.querySelectorAll("#tabla-estadisticas tr").forEach(row => {
        const cols = Array.from(row.querySelectorAll("td")).map(td => td.innerText);
        if (cols.length === 5) {
          data.push(cols);
        }
      });

      if (data.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }

      doc.autoTable({
        head: headers,
        body: data,
        startY: 65, // También subimos esto un poco más para que no se monte con el texto
        theme: 'grid',
        styles: { fontSize: 10 }
      });

      doc.save("informe-estadisticas.pdf");
    };

    img.onerror = function () {
      alert("No se pudo cargar la imagen. Asegúrate de que el archivo exista en './img/logo.jpg'.");
    };
  });
});
