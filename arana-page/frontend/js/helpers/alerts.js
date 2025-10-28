/* ============================================
   Funciones comunes para mostrar alertas con SweetAlert2
   ============================================ */

export function alertaExito(titulo = "Éxito", mensaje = "Operación completada") {
  Swal.fire({ icon: "success", title: titulo, text: mensaje });
}

export function alertaError(titulo = "Error", mensaje = "Ocurrió un problema") {
  Swal.fire({ icon: "error", title: titulo, text: mensaje });
}

export function alertaConfirmacion(texto = "¿Estás seguro?", callback) {
  Swal.fire({
    title: "Confirmar acción",
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar"
  }).then((res) => {
    if (res.isConfirmed && typeof callback === "function") callback();
  });
}
