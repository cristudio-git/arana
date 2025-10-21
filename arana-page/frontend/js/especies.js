import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();

function limpiarEstilosValidacion(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    const fb = form.querySelector('.invalid-feedback.d-block, .invalid-feedback:not(.d-none)');
    if (fb) fb.classList.add('d-none');
}

function validarEspecie(form) {
    let valido = true;
    const nombre = form.querySelector('[id$="nombre_cientifico"]');
    const comun = form.querySelector('[id$="nombre_comun"]');
    const familia = form.querySelector('[id$="familia"]');
    const habitat = form.querySelector('[id$="habitat"]');
    // Selecciona cualquier input cuyo name termine en 'peligrosidad'
    const peligrosidad = form.querySelector('input[name$="peligrosidad"]:checked');
    limpiarEstilosValidacion(form);

    if (!nombre || nombre.value.trim() === "" ) { nombre?.classList.add('is-invalid'); valido = false; }
    if (!comun || comun.value.trim() === "" ) { comun?.classList.add('is-invalid'); valido = false; }
    if (!familia || familia.value.trim() === "" ) { familia?.classList.add('is-invalid'); valido = false; }
    if (!habitat || habitat.value.trim() === "" ) { habitat?.classList.add('is-invalid'); valido = false; }
    if (!peligrosidad) {
        const fb = form.querySelector('#peligrosidad-feedback') || form.querySelector('.invalid-feedback');
        if (fb) fb.classList.remove('d-none');
        valido = false;
    }

    return valido;
}

function renderEspecies(tbody, data, modalEditar, formEditar) {
    if (!tbody) return;
    tbody.innerHTML = "";
    if (data.estado !== "success" || !Array.isArray(data.datos)) {
        tbody.innerHTML = `<tr><td colspan="6">${data.mensaje || 'Sin datos'}</td></tr>`;
        return;
    }
    const frag = document.createDocumentFragment();
    data.datos.forEach(especie => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${especie.id_especie}</td>
            <td>${escapeHtml(especie.nombre_cientifico)}</td>
            <td>${escapeHtml(especie.nombre_comun)}</td>
            <td>${escapeHtml(especie.familia)}</td>
            <td>${escapeHtml(especie.habitat)}</td>
            <td>${escapeHtml(especie.peligrosidad)}</td>
        `;
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => cargarEspecieParaEdicion(especie.id_especie, modalEditar, formEditar));
        frag.appendChild(tr);
    });
    tbody.appendChild(frag);
}

function escapeHtml(str = "") {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
}

// carga tabla
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

// cargar para editar
async function cargarEspecieParaEdicion(id_especie, modalEditar, formEditar) {
    const url = getUrlApi("especies") + "/get";
    try {
        const data = await api.post(url, { filter: `id_especie = ${parseInt(id_especie,10)}` });
        if (data.estado === "success" && data.datos?.length > 0) {
            const especie = data.datos[0];
            limpiarEstilosValidacion(formEditar);
            formEditar.querySelector('#edit_id_especie').value = especie.id_especie;
            formEditar.querySelector('#edit_nombre_cientifico').value = especie.nombre_cientifico;
            formEditar.querySelector('#edit_nombre_comun').value = especie.nombre_comun;
            formEditar.querySelector('#edit_familia').value = especie.familia;
            formEditar.querySelector('#edit_habitat').value = especie.habitat;
          
            formEditar.querySelectorAll('input[name$="peligrosidad"]').forEach(radio => {
                radio.checked = radio.value === especie.peligrosidad;
            });
            modalEditar.show();
        } else {
            console.error("No se encontró especie:", data.mensaje);
        }
    } catch (err) {
        console.error("Error al solicitar especie:", err);
    }
}

// Crear / actualizar / eliminar
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


// --- Lógica Principal (DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de Modales
    const modalAgregarEl = document.getElementById('modalAgregar');
    const modalAgregar = new bootstrap.Modal(modalAgregarEl);
    const modalEditarEl = document.getElementById('modalEditar');
    const modalEditar = new bootstrap.Modal(modalEditarEl); 

    // Elementos de Formulario y Botones
    const btnAgregar = document.getElementById('btnAgregar');
    const formAgregar = modalAgregarEl.querySelector('form');
    const formEditar = modalEditarEl.querySelector('form');
    const btnGuardar = document.getElementById("btnGuardar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnEliminar = document.getElementById("btnEliminar");

    // Cargar la tabla al inicio
    cargarEspecies(modalEditar, formEditar); 

    // BOTÓN 'AGREGAR' (ABRIR Y LIMPIAR)
    btnAgregar.addEventListener("click", () => {
        if (formAgregar) {
            formAgregar.reset(); 
        }
        limpiarEstilosValidacion(formAgregar);
        modalAgregar.show();
    });

    // BOTÓN 'GUARDAR' (CREAR)
    btnGuardar.addEventListener("click", async () => {
        if (!validarEspecie(formAgregar)) return;

        const peligrosidadSeleccionada = formAgregar.querySelector('input[name="peligrosidad"]:checked')?.value || "";
        const nuevaEspecie = {
            nombre_cientifico: formAgregar.querySelector('#nombre_cientifico').value.trim(),
            nombre_comun: formAgregar.querySelector('#nombre_comun').value.trim(),
            familia: formAgregar.querySelector('#familia').value.trim(),
            habitat: formAgregar.querySelector('#habitat').value.trim(),
            peligrosidad: peligrosidadSeleccionada
        };

        try {
            const resultado = await crearEspecie(nuevaEspecie);
            
            if (resultado && resultado.estado === "success") {
                Swal.fire({ icon: 'success', title: 'Agregado Exitoso', text: resultado.mensaje });
                modalAgregar.hide();
                cargarEspecies(modalEditar, formEditar); // Recarga la tabla
            } else {
                Swal.fire({ icon: 'error', title: 'Error al Guardar', text: resultado?.mensaje });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'No se pudo conectar con el servidor.' });
        }
    });

    //BOTÓN 'ACTUALIZAR'
     btnActualizar.addEventListener("click", async () => {
        
        if (!validarEspecie(formEditar)) {
            console.error("Validación del formulario de edición fallida.");
            return; 
        }

       
        const peligrosidadSeleccionada = formEditar.querySelector('input[name="peligrosidad"]:checked')?.value || "";
        
    
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
            
            if (resultado && resultado.estado === "success") {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Actualización Exitosa', 
                    text: resultado.mensaje || 'El registro se actualizó correctamente.' 
                });
                modalEditar.hide();
                cargarEspecies(modalEditar, formEditar); 
            } else {
                
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error al Actualizar', 
                    text: resultado?.mensaje || 'Hubo un problema al actualizar la especie.' 
                });
            }
        } catch (error) {
            
            console.error("Error en la petición de actualización:", error);
            Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'No se pudo contactar con el servidor API.' });
        }
    });
    //BOTÓN 'ELIMINAR'
    btnEliminar.addEventListener("click", () => {
        const id_especie = formEditar.querySelector("#edit_id_especie").value;
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const resultado = await eliminarEspecie(id_especie);
                    
                    if (resultado && resultado.estado === "success") {
                        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                        modalEditar.hide();
                        cargarEspecies(modalEditar, formEditar); 
                    } else {
                        Swal.fire('Error', 'Hubo un error al eliminar.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
                }
            }
        });
    });
});