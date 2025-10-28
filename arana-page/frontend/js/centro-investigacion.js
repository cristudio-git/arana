import { getUrlApi } from "./urls.js";
import APIs from "./api.js";
import { limpiarEstilosValidacion, validarCampos } from "./helpers/forms.js";
import { alertaExito, alertaError, alertaConfirmacion } from "./helpers/alerts.js";

const api = new APIs();

/* === Variables globales === */

let directorList = [];
let ciudadList = [];

/* === Validación === */
function validarCentro(form) {
  const isAgregar = form.closest("#modalAgregar");

  return validarCampos(form, [
    { id: isAgregar ? "nombre_centro" : "edit_nombre_centro", mensaje: "Debe ingresar nombre del centro" },
    { id: isAgregar ? "direccion" : "edit_direccion", mensaje: "Debe ingresar una dirección" },
    { id: isAgregar ? "telefono" : "edit_telefono", mensaje: "Debe ingresar un teléfono válido" },
    { id: isAgregar ? "selectCiudad" : "edit_selectCiudad", mensaje: "Debe seleccionar una ciudad válida" },
    { id: isAgregar ? "selectDirector" : "edit_selectDirector", mensaje: "Debe seleccionar un director válido" },

  ]);
}

/* === Helper para escapar HTML === */
function escapeHtml(str = "") {
  if (str === null || str === undefined) return "—";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* === Render de tabla === */
function renderCentros(tbody, data) {
  tbody.innerHTML = "";
  if (data.estado !== "success" || !Array.isArray(data.datos) || data.datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">${data.mensaje || "Sin datos disponibles"}</td></tr>`;
    return;
  }

  const frag = document.createDocumentFragment();
  data.datos.forEach(c => {
    const ciudad= escapeHtml(c.nombre_ciudad ?? "—");
    const director = escapeHtml(c.nombre_director?? "—");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id_centro}</td>
      <td>${escapeHtml(c.nombre_centro)}</td>
      <td>${ciudad}</td>
      <td>${escapeHtml(c.direccion)}</td>
      <td>${escapeHtml(c.telefono)}</td>
      <td>${director}</td>

    `;
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => cargarCentroParaEdicion(c.id_centro));
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

/* === Rellenar Selects === */
function llenarSelects(selectId, dataList, valueKey, textKey) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Seleccione...</option>`; 
  dataList.forEach(item => {
    const option = document.createElement("option");
    option.value = item[valueKey]; 
    option.textContent = item[textKey]; 
    select.appendChild(option);
  });
}

/* === Cargar Datos Iniciales  === */
async function cargarDatosIniciales() {
  await Promise.all([cargarCiudades(), cargarDirectores()]);
  await cargarCentros();
}

async function cargarCiudades() {
  const url = getUrlApi("ciudades") + "/get"; 
  try {
    const data = await api.get(url);
  if (data.estado === "success" && Array.isArray(data.datos)) {
    ciudadList = data.datos;
    llenarSelects("selectCiudad", ciudadList, "nombre_ciudad", "nombre_ciudad");
    llenarSelects("edit_selectCiudad", ciudadList, "nombre_ciudad", "nombre_ciudad");
  } else {
      console.error("Error al cargar centros:", data.mensaje);
    }
  } catch (err) {
    console.error("Error cargando centros:", err);
  }
}

async function cargarDirectores() {
  const url = getUrlApi("directores") + "/get"; 
  try {
    const data = await api.get(url);
  if (data.estado === "success" && Array.isArray(data.datos)) {
    directorList = data.datos;
    llenarSelects("selectDirector", directorList, "nombre_director", "nombre_director");
    llenarSelects("edit_selectDirector", directorList, "nombre_director", "nombre_director");
  } else {
      console.error("Error al cargar centros:", data.mensaje);
    }
  } catch (err) {
    console.error("Error cargando centros:", err);
  }
}

/* === Cargar Centros === */
async function cargarCentros() {
  const tbody = document.querySelector("#tabla-centros tbody");
  const url = getUrlApi("centros-investigacion") + "/get";

  try {
    const data = await api.get(url);
    renderCentros(tbody, data);
  } catch (err) {
    console.error("Error cargando centros:", err);
    tbody.innerHTML = `<tr><td colspan="6">Error al cargar centros</td></tr>`;
  }
}

async function filtrarCentros(valor) {
  const tbody = document.querySelector("#tabla-centros tbody");
  const url = getUrlApi("centros-investigacion") + "/get"; 

  try {
    
    const data = valor.trim() === ""
      ? await api.get(url)
      : await api.post(url, { filter: `nombre_centro LIKE '${valor}%'` });

    renderCentros(tbody, data);
  } catch (err) {
    console.error("Error filtrando observaciones:", err);
    tbody.innerHTML = `<tr><td colspan="7">Error al filtrar observaciones</td></tr>`;
  }
}

/* === Insertar Centro === */
async function insertarCentro() {
  const modal = document.getElementById("modalAgregar");
  const form = modal.querySelector("form");

    if (!validarCentro(form)) {
   
    return;
  }

  const selectElementCiudad = document.getElementById("selectCiudad"); 
  const nombreCiudadSeleccionado = selectElementCiudad?.value; 
  const selectElementDirector = document.getElementById("selectDirector"); 
  const nombreDirectorSeleccionado = selectElementDirector?.value; 

  if (!nombreCiudadSeleccionado || !nombreDirectorSeleccionado) { 
      alertaError("Debe seleccionar una ciudad y un director válidos.");
      return;
  }

  const centro = {
    nombre_centro: form.querySelector("#nombre_centro").value.trim(),
    nombre_ciudad: nombreCiudadSeleccionado,
    direccion: form.querySelector("#direccion").value.trim(),
    telefono: form.querySelector("#telefono").value.trim(),
    nombre_director: nombreDirectorSeleccionado, 
  };

  const url = getUrlApi("centros-investigacion") + "/insert";

  try {
    const data = await api.post(url, centro);
    if (data.estado === "success") {
      alertaExito("Centro de investigación registrado exitosamente.");
      bootstrap.Modal.getInstance(modal).hide();
      form.reset();
      limpiarEstilosValidacion(form);
      await cargarCentros();
    } else {
      alertaError(`Error al guardar: ${data.mensaje}`);
    }
  } catch (err) {
    console.error("Error al insertar centro:", err);
    alertaError("Error de conexión o del servidor.");
  }
}

/* === Cargar para edición === */
async function cargarCentroParaEdicion(id_centro) {
  const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
  const formEditar = document.querySelector("#modalEditar form");
  limpiarEstilosValidacion(formEditar);

  try {
    const url = getUrlApi("centros-investigacion") + "/get";
    const data = await api.post(url, { filter: `id_centro = ${parseInt(id_centro, 10)}` });

    if (data.estado === "success" && data.datos.length > 0) {
      const c = data.datos[0];
      formEditar.querySelector("#edit_id_centro").value = c.id_centro;
      formEditar.querySelector("#edit_nombre_centro").value = c.nombre_centro;
      formEditar.querySelector("#edit_selectCiudad").value = c.nombre_ciudad;
      formEditar.querySelector("#edit_direccion").value = c.direccion;
      formEditar.querySelector("#edit_telefono").value = c.telefono;
      formEditar.querySelector("#edit_selectDirector").value = c.nombre_director;

      modalEditar.show();
    } else {
      alertaError(`Centro con ID ${id_centro} no encontrado.`);
    }
  } catch (err) {
    console.error("Error al cargar centro:", err);
    alertaError("Error de conexión al cargar datos.");
  }
}

/* === Actualizar Centro === */
async function actualizarCentro() {
  const modal = document.getElementById("modalEditar");
  const form = modal.querySelector("form");

  const nombreCiudadSeleccionado = form.querySelector("#edit_selectCiudad").value;
  const nombreDirectorSeleccionado = form.querySelector("#edit_selectDirector").value;


  if (!validarCentro(form)) return;

  const centro = {
    id_centro: parseInt(form.querySelector("#edit_id_centro").value, 10),
    nombre_centro: form.querySelector("#edit_nombre_centro").value.trim(),
    nombre_ciudad: nombreCiudadSeleccionado,
    direccion: form.querySelector("#edit_direccion").value.trim(),
    telefono: form.querySelector("#edit_telefono").value.trim(),
    nombre_director: nombreDirectorSeleccionado,
  };

  const url = getUrlApi("centros-investigacion") + "/update";

  try {
    const data = await api.post(url, centro);
    if (data.estado === "success") {
      alertaExito("Centro de investigación actualizado exitosamente.");
      bootstrap.Modal.getInstance(modal).hide();
      await cargarCentros();
    } else {
      alertaError(`Error al actualizar: ${data.mensaje}`);
    }
  } catch (err) {
    console.error("Error al actualizar centro:", err);
    alertaError("Error de conexión o del servidor.");
  }
}

/* === Eliminar Centro === */
async function eliminarCentro() {
  const id_centro = document.querySelector("#modalEditar #edit_id_centro").value;

  alertaConfirmacion("¿Está seguro de eliminar este centro?", async () => {
    const url = getUrlApi("centros-investigacion") + "/delete";

    try {
      const data = await api.post(url, { id_centro: parseInt(id_centro, 10) });
      if (data.estado === "success") {
        alertaExito("Centro eliminado exitosamente.");
        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
        await cargarCentros();
      } else {
        alertaError(`Error al eliminar: ${data.mensaje}`);
      }
    } catch (err) {
      console.error("Error al eliminar centro:", err);
      alertaError("Error de conexión o del servidor.");
    }
  });
}

/* === Eventos === */
document.addEventListener("DOMContentLoaded", () => {
  
  cargarDatosIniciales();


  const inputFiltro = document.getElementById("inputFiltro");

  // Filtrar
  inputFiltro.addEventListener("keyup", async (e) => {
    const valor = e.target.value.trim();
    await filtrarCentros(valor);
  });

  document.getElementById("btnAgregar").addEventListener("click", () => {
    const modalAgregar = new bootstrap.Modal(document.getElementById("modalAgregar"));
    document.querySelector("#modalAgregar form").reset();
    limpiarEstilosValidacion(document.querySelector("#modalAgregar form"));
    modalAgregar.show();
  });

  document.getElementById("btnGuardar").addEventListener("click", insertarCentro);
  document.getElementById("btnActualizar").addEventListener("click", actualizarCentro);
  document.getElementById("btnEliminar").addEventListener("click", eliminarCentro);
});
