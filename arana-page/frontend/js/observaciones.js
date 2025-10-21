import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();

/* === Funciones de validación y helpers === */

function limpiarEstilosValidacion(form) {
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    form.querySelectorAll(".invalid-feedback").forEach((fb) => fb.classList.add("d-none"));
}

function validarObservacion(form) {
    let valido = true;
    limpiarEstilosValidacion(form);

    const fecha = form.querySelector('[id$="fecha"]');
    const cantidad = form.querySelector('[id$="cantidad_ejemplares"]');
    const comportamiento = form.querySelector('[id$="comportamiento_observado"]');
    const inversion = form.querySelector('[id$="inversion"]');
    const nombre_comun = form.querySelector('[id$="nombre_comun"]');
    const cod_postal = form.querySelector('[id$="cod_postal"]');

    if (!fecha.value) { fecha.classList.add("is-invalid"); valido = false; }
    if (!cantidad.value || isNaN(cantidad.value)) { cantidad.classList.add("is-invalid"); valido = false; }
    if (!comportamiento.value.trim()) { comportamiento.classList.add("is-invalid"); valido = false; }
    if (!inversion.value || isNaN(inversion.value)) { inversion.classList.add("is-invalid"); valido = false; }
    if (!nombre_comun.value.trim()) { nombre_comun.classList.add("is-invalid"); valido = false; }
    if (!cod_postal.value || isNaN(cod_postal.value)) { cod_postal.classList.add("is-invalid"); valido = false; }

    return valido;
}

function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* === Render de tabla === */
function renderObservaciones(tbody, data, modalEditar, formEditar) {
    tbody.innerHTML = "";
    if (data.estado !== "success" || !Array.isArray(data.datos) || data.datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">${data.mensaje || "Sin datos"}</td></tr>`;
        return;
    }

    const frag = document.createDocumentFragment();
    data.datos.forEach((obs) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${obs.id_observacion}</td>
            <td>${escapeHtml(obs.fecha)}</td>
            <td>${escapeHtml(obs.cantidad_ejemplares)}</td>
            <td>${escapeHtml(obs.comportamiento_observado)}</td>
            <td>${escapeHtml(obs.inversion)}</td>
            <td>${escapeHtml(obs.nombre_especie)}</td>
            <td>${escapeHtml(obs.nombre_centro)}</td>
        `;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => cargarObservacionParaEdicion(obs.id_observacion, modalEditar, formEditar));
        frag.appendChild(tr);
    });
    tbody.appendChild(frag);
}

/* === API Calls === */

async function cargarObservaciones(modalEditar, formEditar) {
    const tbody = document.querySelector("#tabla-observaciones tbody");
    const url = getUrlApi("observaciones") + "/get";

    try {
        const data = await api.get(url);
        renderObservaciones(tbody, data, modalEditar, formEditar);
    } catch (err) {
        console.error("Error cargando observaciones:", err);
        tbody.innerHTML = `<tr><td colspan="8">Error al cargar observaciones</td></tr>`;
    }
}

async function cargarObservacionParaEdicion(id_observacion, modalEditar, formEditar) {
    const url = getUrlApi("observaciones") + "/get";
    const data = await api.post(url, { filter: `id_observacion = ${parseInt(id_observacion, 10)}` });
    if (data.estado === "success" && data.datos.length > 0) {
        const obs = data.datos[0];
        formEditar.querySelector("#edit_id_observacion").value = obs.id_observacion;
        formEditar.querySelector("#edit_fecha").value = obs.fecha;
        formEditar.querySelector("#edit_cantidad_ejemplares").value = obs.cantidad_ejemplares;
        formEditar.querySelector("#edit_comportamiento_observado").value = obs.comportamiento_observado;
        formEditar.querySelector("#edit_inversion").value = obs.inversion;
        formEditar.querySelector("#edit_nombre_comun").value = obs.nombre_especie;
        formEditar.querySelector("#edit_cod_postal").value = obs.cod_postal || "";
        modalEditar.show();
    } else {
        Swal.fire("Error", "No se encontró la observación", "error");
    }
}

async function crearObservacion(nuevaObs) {
    const url = getUrlApi("observaciones") + "/insert";
    return api.post(url, nuevaObs);
}

async function actualizarObservacion(obsActualizada) {
    const url = getUrlApi("observaciones") + "/update";
    return api.put(url, obsActualizada);
}

async function eliminarObservacion(id_observacion) {
    const url = getUrlApi("observaciones") + "/delete";
    return api.delete(url, { id_observacion: parseInt(id_observacion, 10) });
}

async function cargarSelects() {
  try {
    const selectEspecie = document.getElementById("selectEspecie");
    const selectCentro = document.getElementById("selectCentro");
    const editSelectEspecie = document.getElementById("edit_selectEspecie");
    const editSelectCentro = document.getElementById("edit_selectCentro");

    
    if (!selectEspecie || !selectCentro || !editSelectEspecie || !editSelectCentro) {
      console.error("No se encontraron los selects en el DOM:", {
        selectEspecie, selectCentro, editSelectEspecie, editSelectCentro
      });
      return;
    }

    const urlEspecies = getUrlApi("especies") + "/get";
    const urlCentros = getUrlApi("centros-investigacion") + "/get";

    const [resEspecies, resCentros] = await Promise.all([
      api.get(urlEspecies),
      api.get(urlCentros)
    ]);

    
    if (resEspecies.estado === "success") {
      selectEspecie.innerHTML = `<option value="">-- Seleccione especie --</option>`;
      editSelectEspecie.innerHTML = `<option value="">-- Seleccione especie --</option>`;
      resEspecies.datos.forEach(e => {
        
        const valor = e.nombre_comun ?? e.nombre_cientifico ?? e.id_especie;
        const texto = e.nombre_comun ?? e.nombre_cientifico ?? `#${e.id_especie}`;
        selectEspecie.innerHTML += `<option value="${escapeHtml(valor)}" data-id="${e.id_especie}">${escapeHtml(texto)}</option>`;
        editSelectEspecie.innerHTML += `<option value="${escapeHtml(valor)}" data-id="${e.id_especie}">${escapeHtml(texto)}</option>`;
      });
    } else {
      selectEspecie.innerHTML = `<option value="">-- No se encontraron especies --</option>`;
      editSelectEspecie.innerHTML = selectEspecie.innerHTML;
    }

    
    if (resCentros.estado === "success") {
      selectCentro.innerHTML = `<option value="">-- Seleccione centro --</option>`;
      editSelectCentro.innerHTML = `<option value="">-- Seleccione centro --</option>`;
      resCentros.datos.forEach(c => {
        
        const valor = c.cod_postal ?? c.id_centro;
        const texto = c.nombre_centro ?? `Centro #${c.id_centro}`;
        selectCentro.innerHTML += `<option value="${escapeHtml(String(valor))}" data-id="${c.id_centro}">${escapeHtml(texto)}</option>`;
        editSelectCentro.innerHTML += `<option value="${escapeHtml(String(valor))}" data-id="${c.id_centro}">${escapeHtml(texto)}</option>`;
      });
    } else {
      selectCentro.innerHTML = `<option value="">-- No se encontraron centros --</option>`;
      editSelectCentro.innerHTML = selectCentro.innerHTML;
    }

  } catch (err) {
    console.error("Error cargando selects:", err);
   
  }
}

/* === Lógica principal === */

document.addEventListener("DOMContentLoaded", async () => {
    const modalAgregar = new bootstrap.Modal(document.getElementById("modalAgregar"));
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));

    const formAgregar = document.querySelector("#modalAgregar form");
    const formEditar = document.querySelector("#modalEditar form");

    await cargarSelects();
    await cargarObservaciones(modalEditar, formEditar);

    const btnAgregar = document.getElementById("btnAgregar");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnEliminar = document.getElementById("btnEliminar");

    cargarObservaciones(modalEditar, formEditar);

    btnAgregar.addEventListener("click", () => {
        formAgregar.reset();
        limpiarEstilosValidacion(formAgregar);
        modalAgregar.show();
    });

    btnGuardar.addEventListener("click", async () => {
        if (!validarObservacion(formAgregar)) return;

        const nuevaObs = {
            fecha: formAgregar.querySelector("#fecha").value,
            cantidad_ejemplares: formAgregar.querySelector("#cantidad_ejemplares").value,
            comportamiento_observado: formAgregar.querySelector("#comportamiento_observado").value,
            inversion: formAgregar.querySelector("#inversion").value,
           
            nombre_comun: formAgregar.querySelector("#selectEspecie").value,
           
            cod_postal: formAgregar.querySelector("#selectCentro").value
        };


        const resultado = await crearObservacion(nuevaObs);
        if (resultado.estado === "success") {
            Swal.fire("Éxito", resultado.mensaje, "success");
            modalAgregar.hide();
            cargarObservaciones(modalEditar, formEditar);
        } else {
            Swal.fire("Error", resultado.mensaje, "error");
        }
    });

    btnActualizar.addEventListener("click", async () => {
        if (!validarObservacion(formEditar)) return;

        const obsActualizada = {
            id_observacion: formEditar.querySelector("#edit_id_observacion").value,
            fecha: formEditar.querySelector("#edit_fecha").value,
            cantidad_ejemplares: formEditar.querySelector("#edit_cantidad_ejemplares").value,
            comportamiento_observado: formEditar.querySelector("#edit_comportamiento_observado").value,
            inversion: formEditar.querySelector("#edit_inversion").value,
            nombre_comun: formEditar.querySelector("#edit_selectEspecie").value,
            cod_postal: formEditar.querySelector("#edit_selectCentro").value
        };


        const resultado = await actualizarObservacion(obsActualizada);
        if (resultado.estado === "success") {
            Swal.fire("Actualizado", resultado.mensaje, "success");
            modalEditar.hide();
            cargarObservaciones(modalEditar, formEditar);
        } else {
            Swal.fire("Error", resultado.mensaje, "error");
        }
    });

    btnEliminar.addEventListener("click", () => {
        const id = formEditar.querySelector("#edit_id_observacion").value;
        Swal.fire({
            title: "¿Seguro?",
            text: "Esta acción no se puede revertir",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (res) => {
            if (res.isConfirmed) {
                const resultado = await eliminarObservacion(id);
                if (resultado.estado === "success") {
                    Swal.fire("Eliminado", resultado.mensaje, "success");
                    modalEditar.hide();
                    cargarObservaciones(modalEditar, formEditar);
                } else {
                    Swal.fire("Error", resultado.mensaje, "error");
                }
            }
        });
    });
});
