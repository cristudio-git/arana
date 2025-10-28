<?php include '../../backend/includes/header.inc.php'; ?>

<div class="container mt-4">
    <h2 class="mb-4">Centro de investigación</h2>
    <button id="btnAgregar" class="btn btn-primary mb-3">Nuevo Centro</button>

    <table id="tabla-observaciones" class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Comportamiento</th>
                <th>Inversión</th>
                <th>Especie</th>
                <th>Centro</th>
            </tr>
        </thead>
        <tbody><tr><td colspan="8">Cargando...</td></tr></tbody>
    </table>
</div>

<!-- MODAL AGREGAR -->
<div class="modal fade" id="modalAgregar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><h5>Nueva Observación</h5></div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label>Fecha</label>
                        <input type="date" id="fecha" class="form-control">
                        <div class="invalid-feedback">Ingrese una fecha válida</div>
                    </div>
                    <div class="mb-3">
                        <label>Cantidad de Ejemplares</label>
                        <input type="number" id="cantidad_ejemplares" class="form-control">
                        <div class="invalid-feedback">Ingrese un número válido</div>
                    </div>
                    <div class="mb-3">
                        <label>Comportamiento Observado</label>
                        <textarea id="comportamiento_observado" class="form-control"></textarea>
                        <div class="invalid-feedback">Campo obligatorio</div>
                    </div>
                    <div class="mb-3">
                        <label>Inversión</label>
                        <input type="number" step="0.01" id="inversion" class="form-control">
                        <div class="invalid-feedback">Ingrese un valor numérico</div>
                    </div>
                    <div class="mb-3">
                        <label>Especie</label>
                        <select id="selectEspecie" class="form-select">
                            <option value="">Cargando especies...</option>
                        </select>
                        <div class="invalid-feedback">Seleccione una especie</div>
                    </div>
                    <div class="mb-3">
                        <label>Centro</label>
                        <select id="selectCentro" class="form-select">
                            <option value="">Cargando centros...</option>
                        </select>
                        <div class="invalid-feedback">Seleccione un centro</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="btnGuardar" class="btn btn-success">Guardar</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- MODAL EDITAR -->
<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"><h5>Editar Observación</h5></div>
            <div class="modal-body">
                <form>
                    <input type="hidden" id="edit_id_observacion">
                    <div class="mb-3">
                        <label>Fecha</label>
                        <input type="date" id="edit_fecha" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Cantidad de Ejemplares</label>
                        <input type="number" id="edit_cantidad_ejemplares" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Comportamiento Observado</label>
                        <textarea id="edit_comportamiento_observado" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label>Inversión</label>
                        <input type="number" step="0.01" id="edit_inversion" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Especie</label>
                        <select id="edit_selectEspecie" class="form-select">
                            <option value="">Cargando especies...</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label>Centro</label>
                        <select id="edit_selectCentro" class="form-select">
                            <option value="">Cargando centros...</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="btnActualizar" class="btn btn-primary">Actualizar</button>
                <button id="btnEliminar" class="btn btn-danger">Eliminar</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<script type="module" src="js/centro-investigacion.js"></script>

<?php include '../../backend/includes/footer.inc.php'; ?>
