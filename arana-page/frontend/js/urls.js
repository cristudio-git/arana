export function getUrlApi(nombre) {
    const base = "http://arana-page.local/backend/";
    const urls = {
        "especies": "especiesB.php",
        "centros-investigacion": "centrosB.php",
        "observaciones": "observacionesB.php"
    };

    if (!urls[nombre]) {
        throw new Error(`No existe la URL para la clave: ${nombre}`);
    }

    return base + urls[nombre];
}

    