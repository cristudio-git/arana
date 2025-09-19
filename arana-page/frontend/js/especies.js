import APIs from "./api.js";

const api = new APIs();


/**
 * Asynchronously loads the list of locations (especies) from the backend API and populates
 * the table with the retrieved data.
 * @returns None
 */
async function cargarEspecie() {
    const response = await api.call("/backend/especiesB.php", {}, "get");
    const tbody = document.querySelector("#tabla-especies tbody");
    tbody.innerHTML = "";

    if (response.estado === "success") {
        response.datos.forEach(especie => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${especie.cod_especie}</td>
                <td>${especie.cod_ciudad}</td>
                <td>${especie.direccion}</td>
                <td>${especie.telefono}</td>
                <td>${especie.cod_director}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarEspecie(${especie.cod_especie})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEspecie(${especie.cod_especie})">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);
        });
    } else {
        console.error(response.mensaje);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar especies</td></tr>`;
    }
}


async function crearEspecie(nuevaEspecie) {
    return await api.call("/backend/especies.php/insert", nuevaEspecie, "POST", true);

}

document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById("btnAgregar");

    window.addEventListener("DOMContentLoaded", cargarEspecie);

    document.getElementById("btnAgregar").addEventListener("click", () => {
        document.getElementById("formEspecie").reset();
        document.getElementById("cod_especie").value = ""; 

        const modal = new bootstrap.Modal(document.getElementById("modalEspecie"));
        modal.show();
    });

    document.getElementById("formEspecie").addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevaEspecie = {
            cod_ciudad: document.getElementById("cod_ciudad").value,
            direccion: document.getElementById("direccion").value,
            telefono: document.getElementById("telefono").value,
            director: document.getElementById("cod_director").value,
        };

        const response = await crearEspecie(nuevaEspecie);

        if (response?.estado === "success") {
            bootstrap.Modal.getInstance(document.getElementById("modalEspecie")).hide();
            cargarEspecies(); 
        } else {
            alert("Error al crear especie: " + (response?.mensaje || "Desconocido"));
        }
    });





})