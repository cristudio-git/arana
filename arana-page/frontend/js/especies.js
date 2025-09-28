import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();

function renderEspecies(tbody, data) {
  if (data.estado === "success") {
    tbody.innerHTML = "";
    data.datos.forEach((especie) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${especie.id_especie}</td>
        <td>${especie.nombre_cientifico}</td>
        <td>${especie.nombre_comun}</td>
        <td>${especie.familia}</td>
        <td>${especie.habitat}</td>
        <td>${especie.peligrosidad}</td>
      `;
      tbody.appendChild(fila);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="6">${data.mensaje}</td></tr>`;
  }
}

function cargarEspecies() {
  const tbody = document.querySelector("#tabla-especies tbody");
  if (!tbody) return;
  const url = getUrlApi("especies") + "/get";
  api.call(url, "", "get", (data) => {

    renderEspecies(tbody, data);

  }, false);
}


async function crearEspecie(nuevaEspecie) {
    nuevaEspecie = {
        nombre_cientifico: document.getElementById("nombre_cientifico").value,
        nombre_comun: document.getElementById("nombre_comun").value,
        familia: document.getElementById("familia").value,
        habitat: document.getElementById("habitat").value,
        peligrosidad: document.getElementById("peligrosidad").value
    };
    const url = getUrlApi("especies") + "/insert";
    return await api.call(
        url,
        nuevaEspecie,
        "POST",
        (data) => {
            // Aquí puedes manejar la respuesta si lo necesitas
            console.log(data);
        },
        true // Este es el parámetro body
    );
}

document.addEventListener('DOMContentLoaded', () => {
  const modalAgregarEl = document.getElementById('modalAgregar');
  const modalAgregar = new bootstrap.Modal(modalAgregarEl);
  const btnAgregar = document.getElementById('btnAgregar');
  const btnGuardar = document.getElementById('btnGuardar');
  cargarEspecies();

  btnAgregar.addEventListener("click", () => {

      modalAgregar.show();
  });

  btnGuardar.addEventListener("click", () => {
    crearEspecie();
    modalAgregar.hide();  
  });

});
