<?php include '../../backend/includes/header.inc.php'; ?>

<div class="container mt-4">
    <h2 class="mb-4">Gestión de Centros de Investigación</h2>
     <div class="d-flex justify-content-between align-items-center mb-3">
        <button id="btnAgregar" class="btn btn-primary">Nuevo Centro</button>
        <input
            type="text"
            id="inputFiltro"
            class="form-control w-25"
            placeholder="Buscar por nombre del centro..."
        >
    </div>

    <table id="tabla-centros" class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Director</th>
            </tr>
        </thead>
        <tbody><tr><td colspan="6">Cargando...</td></tr></tbody>
    </table>
</div>

<!-- Modal Agregar -->
<div class="modal fade" id="modalAgregar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><h5>Nuevo Centro de Investigación</h5></div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="nombre_centro" class="form-label">Nombre del Centro</label>
                        <input type="text" class="form-control" id="nombre_centro" name="nombre_centro" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="selectCiudad" class="form-label">Ciudad</label>
                        <select id="selectCiudad" name="selectCiudad" class="form-select" required></select>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="direccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="direccion" name="direccion" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="telefono" name="telefono" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="selectDirector" class="form-label">Director</label>
                        <select id="selectDirector" name="selectDirector" class="form-select" required></select>
                        <div class="invalid-feedback d-none"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="btnGuardar" class="btn btn-success">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Editar -->
<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><h5>Editar Centro de Investigación</h5></div>
            <div class="modal-body">
                <form>
                    <input type="hidden" id="edit_id_centro" name="edit_id_centro">

                    <div class="mb-3">
                        <label for="edit_nombre_centro" class="form-label">Nombre del Centro</label>
                        <input type="text" class="form-control" id="edit_nombre_centro" name="edit_nombre_centro" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="edit_selectCiudad" class="form-label">Ciudad</label>
                        <select id="edit_selectCiudad" name="edit_selectCiudad" class="form-select" required></select>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="edit_direccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="edit_direccion" name="edit_direccion" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="edit_telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="edit_telefono" name="edit_telefono" required>
                        <div class="invalid-feedback d-none"></div>
                    </div>

                    <div class="mb-3">
                        <label for="edit_selectDirector" class="form-label">Director</label>
                        <select id="edit_selectDirector" name="edit_selectDirector" class="form-select" required></select>
                        <div class="invalid-feedback d-none"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">  
                <button id="btnEliminar" class="btn btn-danger">Eliminar</button>
                <button id="btnActualizar" class="btn btn-primary">Actualizar</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="../js/centro-investigacion.js"></script>

<?php include '../../backend/includes/footer.inc.php'; ?>
