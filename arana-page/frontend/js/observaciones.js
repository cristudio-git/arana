import { getUrlApi } from "./urls.js";
import APIs from "./api.js";
import { limpiarEstilosValidacion, validarCampos } from "./helpers/forms.js";
import { alertaExito, alertaError, alertaConfirmacion } from "./helpers/alerts.js";

const api = new APIs();

/* === Variables globales === */
let especiesList = [];
let centrosList = [];

/* === Validación === */
function validarObservacion(form) {
  const isAgregar = form.closest('#modalAgregar');
  

  return validarCampos(form, [
    { id: isAgregar ? "fecha" : "edit_fecha", mensaje: "Debe ingresar una fecha válida" },
    { id: isAgregar ? "cantidad_ejemplares" : "edit_cantidad_ejemplares", tipo: "number", mensaje: "Ingrese cantidad válida" },
    { id: isAgregar ? "comportamiento_observado" : "edit_comportamiento_observado", mensaje: "Campo requerido" },
    { id: isAgregar ? "inversion" : "edit_inversion", tipo: "number", mensaje: "Ingrese inversión válida" },
    { id: isAgregar ? "selectEspecie" : "edit_selectEspecie", mensaje: "Seleccione una especie" },
    { id: isAgregar ? "selectCentro" : "edit_selectCentro", mensaje: "Seleccione un centro" }
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
function renderObservaciones(tbody, data) {
  tbody.innerHTML = "";
  if (data.estado !== "success" || !Array.isArray(data.datos) || data.datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">${data.mensaje || "Sin datos disponibles"}</td></tr>`; 
    return;
  }

  const frag = document.createDocumentFragment();
  data.datos.forEach(obs => {
    const especie = escapeHtml(obs.nombre_comun ?? "—");
    const centro = escapeHtml(obs.nombre_centro ?? "—"); 

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${obs.id_observacion}</td>
      <td>${escapeHtml(obs.fecha)}</td>
      <td>${escapeHtml(obs.cantidad_ejemplares)}</td>
      <td>${escapeHtml(obs.comportamiento_observado)}</td>
      <td>${escapeHtml(obs.inversion)}</td>
      <td>${especie}</td>
      <td>${centro}</td>
    `;
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => cargarObservacionParaEdicion(obs.id_observacion));
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
  await Promise.all([cargarEspecies(), cargarCentros()]);
  await cargarObservaciones();
}

async function cargarEspecies() {
  const url = getUrlApi("especies") + "/get"; 
  try {
    const data = await api.get(url);
    if (data.estado === "success" && Array.isArray(data.datos)) {
      especiesList = data.datos;
      llenarSelects("selectEspecie", especiesList, "nombre_comun", "nombre_comun");
      llenarSelects("edit_selectEspecie", especiesList, "nombre_comun", "nombre_comun");
    } else {
      console.error("Error al cargar especies:", data.mensaje);
    }
  } catch (err) {
    console.error("Error cargando especies:", err);
  }
}

async function cargarCentros() {
  const url = getUrlApi("centros-investigacion") + "/get"; 
  try {
    const data = await api.get(url);
    if (data.estado === "success" && Array.isArray(data.datos)) {
      centrosList = data.datos;

      llenarSelects("selectCentro", centrosList, "nombre_centro", "nombre_centro"); 
      llenarSelects("edit_selectCentro", centrosList, "nombre_centro", "nombre_centro");
    } else {
      console.error("Error al cargar centros:", data.mensaje);
    }
  } catch (err) {
    console.error("Error cargando centros:", err);
  }
}

async function cargarObservaciones() {
  const tbody = document.querySelector("#tabla-observaciones tbody");
  const url = getUrlApi("observaciones") + "/get"; 

  try {
    const data = await api.get(url);
    renderObservaciones(tbody, data);
  } catch (err) {
    console.error("Error cargando observaciones:", err);
    tbody.innerHTML = `<tr><td colspan="7">Error al cargar observaciones</td></tr>`;
  }
}

/* === Insertar Observación  === */
async function insertarObservacion() {
  const modal = document.getElementById("modalAgregar");
  const form = modal.querySelector("form");
  
  
  if (!validarObservacion(form)) {
   
    return;
  }
  
  const selectElement = document.getElementById("selectCentro"); 
  const nombreCentroSeleccionado = selectElement?.value; 

 
  if (!nombreCentroSeleccionado || nombreCentroSeleccionado === "") { 
      alertaError("Debe seleccionar un Centro de Investigación válido.");
      return;
  }


  const observacion = {
      fecha: form.querySelector("#fecha").value,
      cantidad_ejemplares: parseInt(form.querySelector("#cantidad_ejemplares").value, 10),
      comportamiento_observado: form.querySelector("#comportamiento_observado").value,
      inversion: parseFloat(form.querySelector("#inversion").value),
      nombre_comun: form.querySelector("#selectEspecie").value,
      nombre_centro: nombreCentroSeleccionado, 
  };
  
  console.log('Objeto de observación final antes de API:', observacion); 

  const url = getUrlApi("observaciones") + "/insert"; 

  try {
    const data = await api.post(url, observacion); 
    if (data.estado === "success") {
      alertaExito("Observación registrada exitosamente.");
      bootstrap.Modal.getInstance(modal).hide();
      form.reset();
      limpiarEstilosValidacion(form);
      await cargarObservaciones();
    } else {
      
      alertaError(`Error al guardar: ${data.mensaje}`);
    }
  } catch (err) {
    console.error("Error al insertar observación:", err);
    alertaError("Error de conexión o del servidor.");
  }
}

/* === Cargar para edición === */
async function cargarObservacionParaEdicion(id_observacion) {
  const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
  const formEditar = document.querySelector("#modalEditar form");
  limpiarEstilosValidacion(formEditar); 

  try {
    const url = getUrlApi("observaciones") + "/get"; 
    const data = await api.post(url, { filter: `id_observacion = ${parseInt(id_observacion, 10)}` });

    if (data.estado === "success" && data.datos.length > 0) {
      const obs = data.datos[0];
      
      formEditar.querySelector("#edit_id_observacion").value = obs.id_observacion;
      formEditar.querySelector("#edit_fecha").value = obs.fecha;
      formEditar.querySelector("#edit_cantidad_ejemplares").value = obs.cantidad_ejemplares;
      formEditar.querySelector("#edit_comportamiento_observado").value = obs.comportamiento_observado;
      formEditar.querySelector("#edit_inversion").value = obs.inversion;

      formEditar.querySelector("#edit_selectEspecie").value = obs.nombre_comun || ''; 

      formEditar.querySelector("#edit_selectCentro").value = obs.nombre_centro || '';

      modalEditar.show();
    } else {
      alertaError(`Error: Observación ${id_observacion} no encontrada.`);
    }
  } catch (err) {
    console.error("Error al cargar observación para edición:", err);
    alertaError("Error de conexión al cargar datos.");
  }
}


/* === Actualizar Observación === */
async function actualizarObservacion() {
  const modal = document.getElementById("modalEditar");
  const form = modal.querySelector("form");

  //Validar campos
  if (!validarObservacion(form)) {

    return;
  }
  
  const nombreCentroSeleccionado = form.querySelector("#edit_selectCentro").value;
  

  const observacion = {
    id_observacion: parseInt(form.querySelector("#edit_id_observacion").value, 10),
    fecha: form.querySelector("#edit_fecha").value,
    cantidad_ejemplares: parseInt(form.querySelector("#edit_cantidad_ejemplares").value, 10),
    comportamiento_observado: form.querySelector("#edit_comportamiento_observado").value,
    inversion: parseFloat(form.querySelector("#edit_inversion").value),
    nombre_comun: form.querySelector("#edit_selectEspecie").value, 
    nombre_centro: nombreCentroSeleccionado,
  };
  
  
  const url = getUrlApi("observaciones") + "/update"; 

  try {
    const data = await api.post(url, observacion);
    if (data.estado === "success") {
      alertaExito("Observación actualizada exitosamente.");
      bootstrap.Modal.getInstance(modal).hide();
      await cargarObservaciones();
    } else {
     
      alertaError(`Error al actualizar: ${data.mensaje}`);
    }
  } catch (err) {
    console.error("Error al actualizar observación:", err);
    alertaError("Error de conexión o del servidor.");
  }
}

/* === Eliminar Observación === */
async function eliminarObservacion() {
  const id_observacion = document.querySelector("#modalEditar #edit_id_observacion").value;

  alertaConfirmacion("¿Está seguro de eliminar esta observación?", async () => {
    const url = getUrlApi("observaciones") + "/delete"; 

    try {
      const data = await api.post(url, { id_observacion: parseInt(id_observacion, 10) });
      if (data.estado === "success") {
        alertaExito("Observación eliminada exitosamente.");
        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
        await cargarObservaciones();
      } else {
        alertaError(`Error al eliminar: ${data.mensaje}`);
      }
    } catch (err) {
      console.error("Error al eliminar observación:", err);
      alertaError("Error de conexión o del servidor.");
    }
  });
}


/* === Event Listeners === */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosIniciales();

  document.getElementById("btnAgregar").addEventListener("click", () => {
    const modalAgregar = new bootstrap.Modal(document.getElementById("modalAgregar"));
    document.querySelector("#modalAgregar form").reset();
    limpiarEstilosValidacion(document.querySelector("#modalAgregar form"));
    modalAgregar.show();
  });

  document.getElementById("btnGuardar").addEventListener("click", insertarObservacion);
  document.getElementById("btnActualizar").addEventListener("click", actualizarObservacion);
  document.getElementById("btnEliminar").addEventListener("click", eliminarObservacion);
});