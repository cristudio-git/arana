import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();

function renderObservaciones(tbody, data) {
  if (data.estado === "success") {
    tbody.innerHTML = "";
    data.datos.forEach((observacion) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${observacion.id_observacion}</td>
        <td>${observacion.fecha}</td>
        <td>${observacion.cantidad_ejemplares}</td>
        <td>${observacion.comportamiento_observado}</td>
        <td>${observacion.inversion}</td>
        <td>${observacion.id_especie}</td>
        <td>${observacion.id_centro}</td>
      `;
      tbody.appendChild(fila);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="6">${data.mensaje}</td></tr>`;
  }
}

function cargarObservaciones() {
  const tbody = document.querySelector("#tabla-especies tbody");
  if (!tbody) return;
  const url = getUrlApi("observaciones") + "/get";
  api.call(
    url, 
    "", 
    "get", 
    (data) => {

    renderObservaciones(tbody, data);

    }, 
    false
  );
}

async function crearObservacion(nuevaEspecie) {
  nuevaEspecie = {
      fecha: document.getElementById("fecha").value,
      cantidad_ejemplares: document.getElementById("cantidad_ejemplares").value,
      comportamiento_observado: document.getElementById("comportamiento_observado").value,
      inversion: document.getElementById("inversion").value,
      id_especie: document.getElementById("id_especie").value,
      id_centro: document.getElementById("id_centro").value
  };
  const url = getUrlApi("especies") + "/insert";
  return await api.call(
      url,
      nuevaEspecie,
      "POST",
      (data) => {
          
          console.log(data);
      },
      true
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const modalAgregarEl = document.getElementById('modalAgregar');
  const modalAgregar = new bootstrap.Modal(modalAgregarEl);
  const btnAgregar = document.getElementById('btnAgregar');
  const btnGuardar = document.getElementById('btnGuardar');
  cargarObservaciones();

  btnAgregar.addEventListener("click", () => {

      modalAgregar.show();
  });

  btnGuardar.addEventListener("click", () => {
    crearObservacion();
    modalAgregar.hide();  
  });

});
