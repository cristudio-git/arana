

import { getUrlApi } from "./urls.js";
import APIs from "./api.js";
import { limpiarEstilosValidacion, validarCampos } from "./helpers/forms.js";
import { alertaExito, alertaError, alertaConfirmacion } from "./helpers/alerts.js";

const api = new APIs();

/* === Validación === */
function validarEspecie(form) {
  return validarCampos(form, [
    { id: "nombre_cientifico", mensaje: "El nombre científico es obligatorio" },
    { id: "nombre_comun", mensaje: "El nombre común es obligatorio" },
    { id: "familia", mensaje: "La familia es obligatoria" },
    { id: "habitat", mensaje: "El hábitat es obligatorio" },
    { id: "peligrosidad", tipo: "radio", mensaje: "Seleccione peligrosidad" }
  ]);
}

/* === Escapar HTML === */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* === Renderizar tabla === */
function renderEspecies(tbody, data, modalEditar, formEditar) {
  if (!tbody) return;
  tbody.innerHTML = "";

  if (data.estado !== "success" || !Array.isArray(data.datos) || data.datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">${data.mensaje || "Sin datos disponibles"}</td></tr>`;
    return;
  }

  const frag = document.createDocumentFragment();
  data.datos.forEach((especie) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${especie.id_especie}</td>
      <td>${escapeHtml(especie.nombre_cientifico)}</td>
      <td>${escapeHtml(especie.nombre_comun)}</td>
      <td>${escapeHtml(especie.familia)}</td>
      <td>${escapeHtml(especie.habitat)}</td>
      <td>${escapeHtml(especie.peligrosidad)}</td>
    `;
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () =>
      cargarEspecieParaEdicion(especie.id_especie, modalEditar, formEditar)
    );
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

/* === Cargar tabla === */
async function cargarEspecies(modalEditar, formEditar) {
  const tbody = document.querySelector("#tabla-especies tbody");
  const url = getUrlApi("especies") + "/get";

  try {
    const data = await api.get(url);
    renderEspecies(tbody, data, modalEditar, formEditar);
  } catch (err) {
    console.error("Error cargando especies:", err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">Error al cargar datos</td></tr>`;
  }
}

/* === Cargar especie para editar === */
async function cargarEspecieParaEdicion(id_especie, modalEditar, formEditar) {
  const url = getUrlApi("especies") + "/get";

  try {
    const data = await api.post(url, { filter: `id_especie = ${parseInt(id_especie, 10)}` });
    if (data.estado === "success" && data.datos?.length > 0) {
      const especie = data.datos[0];
      limpiarEstilosValidacion(formEditar);

      formEditar.querySelector("#edit_id_especie").value = especie.id_especie;
      formEditar.querySelector("#edit_nombre_cientifico").value = especie.nombre_cientifico;
      formEditar.querySelector("#edit_nombre_comun").value = especie.nombre_comun;
      formEditar.querySelector("#edit_familia").value = especie.familia;
      formEditar.querySelector("#edit_habitat").value = especie.habitat;

      formEditar.querySelectorAll('input[name="peligrosidad"]').forEach((radio) => {
        radio.checked = radio.value === especie.peligrosidad;
      });

      modalEditar.show();
    } else {
      alertaError("Error", data.mensaje || "No se encontró la especie seleccionada");
    }
  } catch (err) {
    console.error("Error al solicitar especie:", err);
    alertaError("Error", "No se pudo cargar la especie");
  }
}

/* === CRUD API Calls === */
async function crearEspecie(nuevaEspecie) {
  const url = getUrlApi("especies") + "/insert";
  return api.post(url, nuevaEspecie);
}

async function actualizarEspecie(datosEspecie) {
  const url = getUrlApi("especies") + "/update";
  return api.put(url, datosEspecie);
}

async function eliminarEspecie(id_especie) {
  const url = getUrlApi("especies") + "/delete";
  return api.delete(url, { id_especie: parseInt(id_especie, 10) });
}

/* === Lógica Principal === */
document.addEventListener("DOMContentLoaded", () => {
  const modalAgregarEl = document.getElementById("modalAgregar");
  const modalAgregar = new bootstrap.Modal(modalAgregarEl);
  const modalEditarEl = document.getElementById("modalEditar");
  const modalEditar = new bootstrap.Modal(modalEditarEl);

  const btnAgregar = document.getElementById("btnAgregar");
  const formAgregar = modalAgregarEl.querySelector("form");
  const formEditar = modalEditarEl.querySelector("form");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnActualizar = document.getElementById("btnActualizar");
  const btnEliminar = document.getElementById("btnEliminar");

  /* Cargar tabla inicial */
  cargarEspecies(modalEditar, formEditar);

  /* === Agregar nueva especie === */
  btnAgregar.addEventListener("click", () => {
    formAgregar.reset();
    limpiarEstilosValidacion(formAgregar);
    modalAgregar.show();
  });

  btnGuardar.addEventListener("click", async () => {
    if (!validarEspecie(formAgregar)) return;

    const peligrosidadSeleccionada =
      formAgregar.querySelector('input[name="peligrosidad"]:checked')?.value || "";

    const nuevaEspecie = {
      nombre_cientifico: formAgregar.querySelector("#nombre_cientifico").value.trim(),
      nombre_comun: formAgregar.querySelector("#nombre_comun").value.trim(),
      familia: formAgregar.querySelector("#familia").value.trim(),
      habitat: formAgregar.querySelector("#habitat").value.trim(),
      peligrosidad: peligrosidadSeleccionada
    };

    try {
      const resultado = await crearEspecie(nuevaEspecie);
      if (resultado?.estado === "success") {
        alertaExito("Éxito", resultado.mensaje);
        modalAgregar.hide();
        cargarEspecies(modalEditar, formEditar);
      } else {
        alertaError("Error", resultado?.mensaje || "No se pudo guardar la especie");
      }
    } catch (error) {
      alertaError("Error", "No se pudo conectar con el servidor");
    }
  });

  /* === Actualizar especie existente === */
  btnActualizar.addEventListener("click", async () => {
    if (!validarEspecie(formEditar)) return;

    const peligrosidadSeleccionada =
      formEditar.querySelector('input[name="peligrosidad"]:checked')?.value || "";

    const especieActualizada = {
      id_especie: formEditar.querySelector("#edit_id_especie").value,
      nombre_cientifico: formEditar.querySelector("#edit_nombre_cientifico").value.trim(),
      nombre_comun: formEditar.querySelector("#edit_nombre_comun").value.trim(),
      familia: formEditar.querySelector("#edit_familia").value.trim(),
      habitat: formEditar.querySelector("#edit_habitat").value.trim(),
      peligrosidad: peligrosidadSeleccionada
    };

    try {
      const resultado = await actualizarEspecie(especieActualizada);
      if (resultado?.estado === "success") {
        alertaExito("Actualizado", resultado.mensaje);
        modalEditar.hide();
        cargarEspecies(modalEditar, formEditar);
      } else {
        alertaError("Error", resultado?.mensaje || "No se pudo actualizar la especie");
      }
    } catch (error) {
      alertaError("Error", "Error al conectar con el servidor");
    }
  });

  /* === Eliminar especie === */
  btnEliminar.addEventListener("click", () => {
    const id_especie = formEditar.querySelector("#edit_id_especie").value;

    alertaConfirmacion("¿Seguro que deseas eliminar esta especie?", async () => {
      try {
        const resultado = await eliminarEspecie(id_especie);
        if (resultado?.estado === "success") {
          alertaExito("Eliminado", resultado.mensaje);
          modalEditar.hide();
          cargarEspecies(modalEditar, formEditar);
        } else {
          alertaError("Error", resultado?.mensaje || "Hubo un problema al eliminar");
        }
      } catch (error) {
        alertaError("Error", "No se pudo conectar con el servidor");
      }
    });
  });
});
