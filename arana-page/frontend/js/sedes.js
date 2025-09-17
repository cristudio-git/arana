import APIs from "./api.js";

const api = new APIs();


/**
 * Asynchronously loads the list of locations (sedes) from the backend API and populates
 * the table with the retrieved data.
 * @returns None
 */
async function cargarSedes() {
    const response = await api.call("/backend/sedesB.php/get", {}, "GET");
    const tbody = document.querySelector("#tablaSedes tbody");
    tbody.innerHTML = "";

    if (response.estado === "success") {
        response.datos.forEach(sede => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${sede.cod_sede}</td>
                <td>${sede.cod_ciudad}</td>
                <td>${sede.direccion}</td>
                <td>${sede.telefono}</td>
                <td>${sede.cod_director}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarSede(${sede.cod_sede})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarSede(${sede.cod_sede})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);
        });
    } else {
        console.error(response.mensaje);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar sedes</td></tr>`;
    }
}


async function crearSede(nuevaSede) {
    return await api.call("/backend/sedes.php/insert", nuevaSede, "POST", true);

}

document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById("btnAgregar");

    window.addEventListener("DOMContentLoaded", cargarSedes);

    document.getElementById("btnAgregar").addEventListener("click", () => {
        document.getElementById("formSede").reset();
        document.getElementById("cod_sede").value = ""; 

        const modal = new bootstrap.Modal(document.getElementById("modalSede"));
        modal.show();
    });

    document.getElementById("formSede").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevaSede = {
            cod_ciudad: document.getElementById("cod_ciudad").value,
            direccion: document.getElementById("direccion").value,
            telefono: document.getElementById("telefono").value,
            director: document.getElementById("cod_director").value,
        };

        const response = await crearSede(nuevaSede);

        if (response?.estado === "success") {
            bootstrap.Modal.getInstance(document.getElementById("modalSede")).hide();
            cargarSedes(); 
        } else {
            alert("Error al crear sede: " + (response?.mensaje || "Desconocido"));
        }
    });





})