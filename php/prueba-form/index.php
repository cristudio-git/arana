<?php
// Procesamiento al enviar el formulario
$telefonos = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['telefonos']) && is_array($_POST['telefonos'])) {
        $telefonos = $_POST['telefonos'];
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Formulario con múltiples teléfonos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Registrar Proveedor con Teléfonos</h1>

    <form id="form-proveedor">
        <input type="text" name="nombre" placeholder="Nombre del proveedor" required><br><br>

        <div id="telefonos-container">
            <div class="telefono-item">
                <input type="text" name="telefonos[0][telefono]" placeholder="Teléfono" required>
                <input type="text" name="telefonos[0][nombre_contacto]" placeholder="Nombre de contacto" required>
            </div>
        </div>

        <button type="button" id="agregar-telefono">Agregar Teléfono</button>
        <button type="submit">Guardar</button>
    </form>
    <div id="mensaje"></div>

    <?php if (!empty($telefonos)): ?>
        <h2>Teléfonos recibidos:</h2>
        <ul>
            <?php foreach ($telefonos as $index => $tel): ?>
                <li>
                    Teléfono: <strong><?= htmlspecialchars($tel['telefono']) ?></strong>,
                    Contacto: <strong><?= htmlspecialchars($tel['nombre_contacto']) ?></strong>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <script>
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('telefonos-container');
    const addBtn = document.getElementById('agregar-telefono');
    const form = document.getElementById('form-proveedor');
    const mensaje = document.getElementById('mensaje');

    let index = 1;

    // Función para agregar nuevo teléfono
    addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.classList.add('telefono-item');

        div.innerHTML = `
            <input type="text" name="telefonos[${index}][telefono]" placeholder="Teléfono" required>
            <input type="text" name="telefonos[${index}][nombre_contacto]" placeholder="Nombre de contacto" required>
            <button type="button" class="eliminar">Eliminar</button>
        `;

        container.appendChild(div);

        div.querySelector('.eliminar').addEventListener('click', () => {
            div.remove();
        });

        index++;
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío normal del formulario

        // Recoger el nombre del proveedor
        const nombre = form.nombre.value;

        // Recoger todos los teléfonos
        const telefonos = [];
        const telefonoInputs = container.querySelectorAll('div.telefono-item');

        telefonoInputs.forEach((item, idx) => {
            const telefono = item.querySelector(`[name="telefonos[${idx}][telefono]"]`).value;
            const contacto = item.querySelector(`[name="telefonos[${idx}][nombre_contacto]"]`).value;

            if (telefono && contacto) {
                telefonos.push({
                    telefono,
                    nombre_contacto: contacto
                });
            }
        });

        // Validación básica
        if (!nombre || telefonos.length === 0) {
            mensaje.innerHTML = '<p style="color:red;">Por favor completa todos los campos.</p>';
            return;
        }

        // Datos a enviar
        const datos = {
            nombre,
            telefonos
        };

        // URL de la API donde vas a enviar los datos
        const apiUrl = 'https://tu-api-ejemplo.com/api/guardar '; // 👈 Cámbiala por tu URL real

        // Enviar los datos como JSON
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            mensaje.innerHTML = '<p style="color:green;">Datos enviados correctamente.</p>';
            console.log('Respuesta de la API:', data);
        })
        .catch(error => {
            mensaje.innerHTML = '<p style="color:red;">Error al enviar los datos.</p>';
            console.error('Error:', error);
        });
    });
});
</script>
</body>
</html>
