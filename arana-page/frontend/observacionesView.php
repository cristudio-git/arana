<?php include '../backend/includes/header.inc.php'; ?>

<h1 class="mb-4">Especies de Arañas</h1>

<div class="d-flex">
  <button class="btn btn-success mb-3 ms-3" id="btnAgregar">Agregar Especie</button>
</div>

 <table class="table table-striped-columns" id="tabla-especies">
    <thead class="table-dark">
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Cantidad de ejemplares</th>
        <th>Comportamiento observado</th>
        <th>Inversión</th>
        <th>Especie</th>
        <th>Centro</th>
      </tr>
    </thead>
    <tbody>
      <!-- Se llena dinámicamente con JS -->
    </tbody>
  </table>

<!-- <button 
  class="btn btn-success mb-3" 
  id="btnAgregar"
  data-bs-toggle="modal" 
  data-bs-target="#modalAgregar">
  Agregar Especie
</button> -->

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
              <label for="fecha" class="col-form-label">Fecha</label>
              <input type="date" class="form-control" id="fecha">
            </div>
            <div class="mb-3">
              <label for="cantidad_ejemplares" class="col-form-label">Cantidad de ejemplares</label>
              <input type="text" class="form-control" id="cantidad_ejemplares">
            </div>
            <div class="mb-3">
              <label for="comportamiento_observado" class="col-form-label">Comportamiento observado</label>
              <input type="text" class="form-control" id="comportamiento_observado">
            </div>
            <div class="mb-3">
              <label for="inversion" class="col-form-label">Inversión</label>
              <input type="text" class="form-control" id="inversion">
            </div>
               <div class="mb-3">
              <label for="id_especie" class="col-form-label">Especie</label>
              <input type="text" class="form-control" id="id_especie">
            </div>
            <div class="mb-3">
              <label for="id_centro" class="col-form-label">Centro</label>
              <input type="text" class="form-control" id="id_centro">
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

<script type="module" src="js/observaciones.js"></script>

<?php include '../backend/includes/footer.inc.php'; ?>
