<?php include '../backend/includes/header.inc.php'; ?>

<h1 class="mb-4">Especies de Arañas</h1>

<!-- Botón agregar especie -->
<button class="btn btn-success mb-3" id="btnAgregar">Agregar Especie</button>

  <table class="table table-bordered table-striped" id="tabla-especies">
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

<script type="module" src="js/especies.js"></script>

<?php include '../backend/includes/footer.inc.php'; ?>
