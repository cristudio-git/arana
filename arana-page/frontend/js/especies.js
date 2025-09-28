import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();



function cargarEspecies() {
  const tbody = document.querySelector("#tabla-especies tbody");
  if (!tbody) return;
  const url = getUrlApi("especies") + "/get";

  api.call(url, "", "GET", (data) => {
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
  }, false);
}



async function crearEspecie(nuevaEspecie) {
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
    const btnAgregar = document.getElementById("btnAgregar");

    cargarEspecies();

    document.getElementById("btnAgregar").addEventListener("click", () => {
      crearEspecie();
    });

})