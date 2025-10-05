<?php include '../backend/includes/header.inc.php'; ?>

<h1 class="mb-4">Especies de Arañas</h1>

<div class="d-flex">
  <button class="btn btn-success mb-3 ms-3" id="btnAgregar">Agregar Especie</button>
</div>

 <table class="table table-striped-columns" id="tabla-especies">
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Nombre Científico</th>
        <th>Nombre Común</th>
        <th>Familia</th>
        <th>Hábitat</th>
        <th>Peligrosidad</th>
      </tr>
    </thead>
    <tbody>
      <!-- Se llena dinámicamente con JS -->
    </tbody>
  </table>

  <!-- MODAL AGREGAR -->

  <div class="modal fade" id="modalAgregar" tabindex="-1" aria-labelledby="agregarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="agregarModalLabel">Especie</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="nombre_cientifico" class="col-form-label">Nombre cientifico</label>
              <input type="text" class="form-control" id="nombre_cientifico">
              <div class="invalid-feedback">El nombre cientifico es obligatorio</div>
            </div>
            <div class="mb-3">
              <label for="nombre_comun" class="col-form-label">Nombre común</label>
              <input type="text" class="form-control" id="nombre_comun">  
              <div class="invalid-feedback">El nombre común es obligatorio</div>
            </div>
            <div class="mb-3">
              <label for="familia" class="col-form-label">Familia</label>
              <input type="text" class="form-control" id="familia"> 
              <div class="invalid-feedback">LA familia es obligatoria</div>
            </div>
            <div class="mb-3">
              <label for="habitat" class="col-form-label">Hábitat</label>
              <input type="text" class="form-control" id="habitat">
              <div class="invalid-feedback">El hábitat es obligatorio.</div>
            </div>
            
            <div class="mb-3">
              <label class="col-form-label d-block mb-2">Peligrosidad</label>
              <div id="peligrosidad-feedback" class="invalid-feedback d-none">
                Debe seleccionar un nivel de peligrosidad.
              </div>

              <input type="radio" class="btn-check" name="peligrosidad" id="peligrosidadAlta" value="Alto" autocomplete="off">
              <label class="btn btn-outline-danger me-2" for="peligrosidadAlta">Alta</label>

              <input type="radio" class="btn-check" name="peligrosidad" id="peligrosidadMedia" value="Medio" autocomplete="off">
              <label class="btn btn-outline-warning me-2" for="peligrosidadMedia">Media</label>

              <input type="radio" class="btn-check" name="peligrosidad" id="peligrosidadBaja" value="Bajo" autocomplete="on">
              <label class="btn btn-outline-success" for="peligrosidadBaja">Baja</label>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Cerrar</button>
          <button type="button" class="btn btn-primary" id="btnGuardar">Guardar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL EDITAR -->

<div class="modal fade" id="modalEditar" tabindex="-1" aria-labelledby="editarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editarModalLabel">Editar Especie</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditar">
                    <input type="hidden" id="edit_id_especie"> 
                    
                    <div class="mb-3">
                      <label for="edit_nombre_cientifico" class="col-form-label">Nombre cientifico</label>
                      <input type="text" class="form-control" id="edit_nombre_cientifico">
                      <div class="invalid-feedback">El nombre cientifico es obligatorio</div>
                    </div>
                    <div class="mb-3">
                      <label for="edit_nombre_comun" class="col-form-label">Nombre común</label>
                      <input type="text" class="form-control" id="edit_nombre_comun">  
                      <div class="invalid-feedback">El nombre común es obligatorio</div>
                    </div>
                    <div class="mb-3">
                      <label for="edit_familia" class="col-form-label">Familia</label>
                      <input type="text" class="form-control" id="edit_familia"> 
                      <div class="invalid-feedback">LA familia es obligatoria</div>
                    </div>
                    <div class="mb-3">
                      <label for="edit_habitat" class="col-form-label">Hábitat</label>
                      <input type="text" class="form-control" id="edit_habitat">
                      <div class="invalid-feedback">El hábitat es obligatorio.</div>
                    </div>
                    
                    <div class="mb-3">
                      <label class="col-form-label d-block mb-2">Peligrosidad</label>
                      <div id="peligrosidad-feedback" class="invalid-feedback d-none">
                        Debe seleccionar un nivel de peligrosidad.
                      </div>

                      <input type="radio" class="btn-check" name="peligrosidad" id="edit_peligrosidadAlta" value="Alto" autocomplete="off">
                      <label class="btn btn-outline-danger me-2" for="edit_peligrosidadAlta">Alta</label>

                      <input type="radio" class="btn-check" name="peligrosidad" id="edit_peligrosidadMedia" value="Medio" autocomplete="off">
                      <label class="btn btn-outline-warning me-2" for="edit_peligrosidadMedia">Media</label>

                      <input type="radio" class="btn-check" name="peligrosidad" id="edit_peligrosidadBaja" value="Bajo" autocomplete="on">
                      <label class="btn btn-outline-success" for="edit_peligrosidadBaja">Baja</label>
                    </div>

                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger me-auto" id="btnEliminar">Eliminar</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnActualizar">Actualizar</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="js/especies.js"></script>

<?php include '../backend/includes/footer.inc.php'; ?>
