<?php

include "autoload.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    die();
}

header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json; charset=utf-8');

$url = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$aUrl = explode("/", $url);
$metodo_a_ejecutar = $aUrl[sizeof($aUrl) - 1];

$allowed = ['get','insert','update','delete'];
if (!in_array($metodo_a_ejecutar, $allowed)) {
    echo json_encode(["estado" => "Error", "mensaje" => "Método no permitido"]);
    exit;
}

$datos = file_get_contents("php://input");
$objModel = new AranaModel();
$response = $objModel->{$metodo_a_ejecutar}($datos);
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
