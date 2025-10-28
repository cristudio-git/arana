/**
 * Limpia los estilos de validación en un formulario
 */
export function limpiarEstilosValidacion(form) {
  if (!form) return;
  
  form.querySelectorAll(".is-invalid").forEach((el) => {
    el.classList.remove("is-invalid");
    
    const fb = el.nextElementSibling;
    if (fb && fb.classList.contains("invalid-feedback")) {
      fb.textContent = '';
    }
  });
}


export function mostrarError(input, mensaje = "Campo obligatorio") {
  if (!input) return;

  input.classList.add("is-invalid");
  
  let fb = input.nextElementSibling;

  if (fb && fb.classList.contains("invalid-feedback")) {
    fb.textContent = mensaje;

  } else {
    console.warn("No se encontró div.invalid-feedback adyacente para el input:", input.id);
  }
}

/**
 * Valida campos requeridos de un formulario.
 * @param {HTMLFormElement} form - formulario a validar
 * @param {Array} campos - array de objetos { id, tipo, mensaje }
 * @returns {boolean} true si es válido
 */
export function validarCampos(form, campos = []) {
  if (!form) return false;
  
  limpiarEstilosValidacion(form);

  let valido = true;

  campos.forEach(({ id, tipo = "text", mensaje = "Campo obligatorio" }) => {
    const input = form.querySelector(`#${id}`);
    if (!input) return;

    
    const valor = input.value?.trim();

    if (tipo === "number") {
     
  
      if (valor === "" || !Number.isFinite(parseFloat(valor))) {
        mostrarError(input, mensaje);
        valido = false;
      }
    } else if (tipo === "radio") {
      
      const radios = form.querySelectorAll(`input[name="${id}"]:checked`);
      if (radios.length === 0) {
       
        const firstRadio = form.querySelector(`input[name="${id}"]`);
        if (firstRadio) {
            
            firstRadio.classList.add("is-invalid"); 
        }
        valido = false;
      }
    } else {
      
      if (!valor) {
        mostrarError(input, mensaje);
        valido = false;
      }
    }
  });

  return valido;
}