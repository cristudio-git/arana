<?php include '../backend/includes/header.inc.php'; ?>

<h1 class="mb-4">Especies de Arañas</h1>

<!-- Botón agregar especie -->
<button class="btn btn-success mb-3" id="btnAgregar">Agregar Especie</button>

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
              <label for="nombre_cientifico" class="col-form-label">Nombre cientifico</label>
              <input type="text" class="form-control" id="nombre_cientifico">
            </div>
            <div class="mb-3">
              <label for="nombre_comun" class="col-form-label">Nombre común</label>
              <textarea class="form-control" id="nombre_comun"></textarea>
            </div>
            <div class="mb-3">
              <label for="familia" class="col-form-label">Familia</label>
              <textarea class="form-control" id="familia"></textarea>
            </div>
            <div class="mb-3">
              <label for="habitat" class="col-form-label">Hábitat</label>
              <textarea class="form-control" id="habitat"></textarea>
            </div>
            <div class="mb-3">
              <label for="peligrosidad" class="col-form-label">Peligrosidad</label>
              <textarea class="form-control" id="peligrosidad"></textarea>
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

<script type="module" src="js/especies.js"></script>

<?php include '../backend/includes/footer.inc.php'; ?>
