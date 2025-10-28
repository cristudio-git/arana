/**
 * Limpia los estilos de validación en un formulario.
 */
export function limpiarEstilosValidacion(form) {
  if (!form) return;

  form.querySelectorAll(".is-invalid").forEach((el) => {
    el.classList.remove("is-invalid");
  });

  form.querySelectorAll(".invalid-feedback").forEach((fb) => {
    fb.textContent = "";
    fb.classList.add("d-none");
  });
}

/**
 * Muestra un mensaje de error en un campo.
 */
export function mostrarError(input, mensaje = "Campo obligatorio") {
  if (!input) return;

  input.classList.add("is-invalid");

  let fb = input.nextElementSibling;

  if (fb && fb.classList.contains("invalid-feedback")) {
    fb.textContent = mensaje;
    fb.classList.remove("d-none");
  } else {
    // si no está el div justo al lado, intenta buscarlo más abajo
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) {
      feedback.textContent = mensaje;
      feedback.classList.remove("d-none");
    } else {
      console.warn("No se encontró div.invalid-feedback para el input:", input.id);
    }
  }
}

/**
 * Valida los campos requeridos de un formulario.
 * 
 * @param {HTMLFormElement} form - formulario a validar
 * @param {Array} campos - array de objetos { id, tipo, mensaje }
 * @returns {boolean} true si es válido
 */
export function validarCampos(form, campos = []) {
  if (!form) return false;

  limpiarEstilosValidacion(form);
  let valido = true;

  campos.forEach(({ id, tipo = "text", mensaje = "Campo obligatorio" }) => {
    let input = form.querySelector(`#${id}`);

    if (!input) {
      // si es radio o select
      if (tipo === "radio") {
        input = form.querySelector(`input[name="${id}"]`);
      } else if (tipo === "select") {
        input = form.querySelector(`select[name="${id}"], #${id}`);
      }
    }

    if (!input) return;

   
    let valor = "";
    if (tipo === "radio") {
      const radios = form.querySelectorAll(`input[name="${id}"]:checked`);
      if (radios.length === 0) {
        
        const feedback = form.querySelector(`#${id}-feedback`);
        if (feedback) feedback.classList.remove("d-none");
        valido = false;
      }
      return;
    }

    if (input.tagName === "SELECT") {
      valor = input.value;
      if (!valor || valor === "") {
        mostrarError(input, mensaje);
        valido = false;
      }
      return;
    }

    valor = input.value?.trim();

    if (tipo === "number") {
      if (valor === "" || !Number.isFinite(parseFloat(valor))) {
        mostrarError(input, mensaje);
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
