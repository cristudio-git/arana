<?php include '../backend/includes/header.inc.php'; ?>

<h1 class="mb-4">Especies de Arañas</h1>

<!-- Botón agregar especie -->
<button class="btn btn-success mb-3" id="btnAgregar">Agregar Especie</button>

<!-- Tabla especie -->
<table class="table table-bordered table-striped" id="tabla-especies">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre Científico</th>
      <th>Nombre Común</th>
      <th>Familia</th>
      <th>Hábitat</th>
      <th>Peligrosidad</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<!-- Modal único para ver/editar/agregar -->
<div class="modal fade" id="modalEspecie" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalTitle">Especie</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="form-especie" enctype="multipart/form-data">
          <input type="hidden" id="id_especie">

          <!-- Imagen de la especie -->
          <div class="mb-3 text-center">
            <img id="imgEspecie" src="img/argentata00.jpg" alt="Foto Especie" class="img-fluid mb-2" style="max-height:200px;">
            <input type="file" id="foto_especie" class="form-control">
          </div>

          <div class="mb-3">
            <label>Nombre Científico</label>
            <input type="text" id="nombre_cientifico" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Nombre Común</label>
            <input type="text" id="nombre_comun" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Familia</label>
            <input type="text" id="familia" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Hábitat</label>
            <input type="text" id="habitat" class="form-control" required>
          </div>
          <div class="mb-3">
            <label>Peligrosidad</label>
            <select id="peligrosidad" class="form-select" required>
              <option value="">Seleccionar</option>
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary" id="btnGuardar">Guardar</button>
            <button type="button" class="btn btn-danger" id="btnEliminar">Eliminar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<?php include '../backend/includes/footer.inc.php'; ?>
