<?php
include "autoload.php";

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Pongo los encabezados por si me conecto desde javascript de otro servidor,
// me autorice la política CORS.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
header('Access-Control-Allow-Method: GET, POST, OPTIONS, PUT, DELETE');
header('Allow: GET, POST, OPTIONS, PUT, DELETE');

//Tomo la url y la convierto en array
$url = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$aUrl = explode("/", $url);

//Recupero el nombre del metodo a ejecutar
$metodo_a_ejecutar = $aUrl[sizeof($aUrl) - 1];

$datos = file_get_contents("php://input");

$objModel = new AranaModel();

// $objModel = new CentroInvestigacionModel();
$response = $objModel->{$metodo_a_ejecutar}($datos);
echo json_encode($response);

?>