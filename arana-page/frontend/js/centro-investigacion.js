import { getUrlApi } from "./urls.js";
import APIs from "./api.js";
import { limpiarEstilosValidacion, validarFormulario } from "../helpers/forms.js";
import { renderTabla } from "./helpers/render.js";
import { limpiarEstilosValidacion, validarCampos } from "./helpers/forms.js";
import { alertaExito, alertaError, alertaConfirmacion } from "./helpers/alerts.js";

const api = new APIs();
const entidad = "centro-investigacion";

// === Cargar registros ===
async function cargarDatos() {
  const tbody = document.querySelector(`#tabla-${entidad} tbody`);
  const url = getUrlApi(entidad) + "/get";

  try {
    const data = await api.get(url);
    renderTabla(tbody, data, (item) => {
      
      cargarParaEdicion(item.id_especie); 
    });
  } catch (error) {
    console.error(`Error cargando ${entidad}:`, error);
    tbody.innerHTML = `<tr><td colspan="6">Error al cargar datos</td></tr>`;
  }
}
