import { getUrlApi } from "./urls.js";
import APIs from "./api.js";

const api = new APIs();

// --- Funciones de Utilidad ---

function limpiarEstilosValidacion(form) {
    // Busca y limpia estilos de error dentro del formulario pasado como argumento
    form.querySelectorAll('.form-control.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });

    // limpiar peligrosidad
    const feedbackPeligrosidad = document.getElementById('peligrosidad-feedback');
    if (feedbackPeligrosidad) {
        feedbackPeligrosidad.classList.add('d-none');
    }
}

/**
 * Valida un formulario específico (Agregar o Editar).
 * @param {HTMLElement} form - El elemento <form> a validar.
 */
function validarEspecie(form) {
    let valido = true;

    // Determina los IDs de los campos dentro del formulario que se está validando.
    // Si es el modalEditar, buscará los campos con prefijo 'edit_'.
    const prefix = form.id === 'formEditar' ? 'edit_' : '';

    const nombreCientifico = form.querySelector(`#${prefix}nombre_cientifico`);
    const nombreComun = form.querySelector(`#${prefix}nombre_comun`);
    const familia = form.querySelector(`#${prefix}familia`);
    const habitat = form.querySelector(`#${prefix}habitat`);
    
    // Peligrosidad: se verifica que esté dentro del form.
    const peligrosidad = form.querySelector('input[name="peligrosidad"]:checked'); 
    const peligrosidadFeedback = document.getElementById("peligrosidad-feedback");

    //  Si los elementos existen, limpiar estilos antes de re-validar
    if (nombreCientifico) nombreCientifico.classList.remove("is-invalid");
    if (nombreComun) nombreComun.classList.remove("is-invalid");
    if (familia) familia.classList.remove("is-invalid");
    if (habitat) habitat.classList.remove("is-invalid");
    if (peligrosidadFeedback) peligrosidadFeedback.classList.add("d-none");

    // Lógica de validación
    if (!nombreCientifico || nombreCientifico.value.trim() === "" || !/^[A-Z][a-z]+(\s[a-z]+)*$/.test(nombreCientifico.value.trim())) {
        if (nombreCientifico) nombreCientifico.classList.add("is-invalid");
        valido = false;
    }
    if (!nombreComun || nombreComun.value.trim() === "") {
        if (nombreComun) nombreComun.classList.add("is-invalid");
        valido = false;
    }
    if (!familia || familia.value.trim() === "") {
        if (familia) familia.classList.add("is-invalid");
        valido = false;
    }
    if (!habitat || habitat.value.trim() === "") {
        if (habitat) habitat.classList.add("is-invalid");
        valido = false;
    }
    if (!peligrosidad) {
        if (peligrosidadFeedback) peligrosidadFeedback.classList.remove("d-none");
        valido = false;
    }

    return valido;
}


// --- LÓGICA DE EDICIÓN  ---


/**
 * Carga los datos de una especie en el formulario de edición y muestra el modal.
 * @param {number} id_especie - El ID de la especie a cargar.
 */
function cargarEspecieParaEdicion(id_especie, modalEditar, formEditar) {
    const filtro = { "filter": `id_especie = ${id_especie}` };
    const url = getUrlApi("especies") + "/get";

    api.call(url, filtro, "POST", (data) => {
        if (data.estado === "success" && data.datos?.length > 0) {
            const especie = data.datos[0];
            limpiarEstilosValidacion(formEditar);

            formEditar.querySelector('#edit_id_especie').value = especie.id_especie;
            formEditar.querySelector('#edit_nombre_cientifico').value = especie.nombre_cientifico;
            formEditar.querySelector('#edit_nombre_comun').value = especie.nombre_comun;
            formEditar.querySelector('#edit_familia').value = especie.familia;
            formEditar.querySelector('#edit_habitat').value = especie.habitat;

            // --- Seleccionar el radio correcto ---
            const valorPeligrosidad = especie.peligrosidad;

            // Se busca dentro del formEditar radios con name edit_peligrosidad
            formEditar.querySelectorAll('input[name="edit_peligrosidad"]').forEach(radio => {
                radio.checked = radio.value === valorPeligrosidad;
            });

            modalEditar.show();
        } else {
            console.error("Error al obtener la especie:", data.mensaje);
        }
    }, true);
}



function renderEspecies(tbody, data, modalEditar, formEditar) { 
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
            
            fila.style.cursor = 'pointer'; 
            fila.addEventListener('click', () => {
              
                cargarEspecieParaEdicion(especie.id_especie, modalEditar, formEditar);
            });

            tbody.appendChild(fila);
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="6">${data.mensaje}</td></tr>`;
    }
}

// --- Función para cargar la tabla ---

function cargarEspecies(modalEditar, formEditar) { 
  const tbody = document.querySelector("#tabla-especies tbody");
  if (!tbody) return;
  const url = getUrlApi("especies") + "/get";
  api.call(
    url, 
    "", 
    "get", 
    (data) => {
        renderEspecies(tbody, data, modalEditar, formEditar); 
    }, 
    false
  );
}



function crearEspecie(nuevaEspecie) {
    const url = getUrlApi("especies") + "/insert";
    return new Promise((resolve, reject) => {
        api.call(url, nuevaEspecie, "POST", resolve, true, reject);
    });
}

function actualizarEspecie(datosEspecie) {
    const url = getUrlApi("especies") + "/update";
    return new Promise((resolve, reject) => {
        api.call(url, datosEspecie, "PUT", resolve, true, reject);
    });
}


function eliminarEspecie(id_especie) {
   
    const url = getUrlApi("especies") + "/delete"; 
    
   
    const datosAEliminar = { id_especie: id_especie }; 
    
    return new Promise((resolve, reject) => {
        
        api.call(
            url, 
            datosAEliminar, 
            "DELETE", 
            resolve, 
            true, // 'true' indica que hay datos en el body (JSON)
            reject
        );
    });
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