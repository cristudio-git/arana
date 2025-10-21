<?php
require_once(__DIR__ . "/../includes/database.inc.php");

class ObservacionModel {
    
    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter,true);
        $aResponse = [];
        $sqlBase = "SELECT * FROM observacion";

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "ERROR", "mensaje" => $objDB->getMensajeError()];
        }

        // condición SQL segura (se recomienda filtrar por id en el frontend)
        if (is_array($aFilter) && !empty($aFilter["filter"])) {
            // desde el frontend se debe pasar algo asi(ej: "id_especie = 3")
            $sql = $sqlBase . " WHERE " . $aFilter["filter"] . " ORDER BY id_especie ASC";
            $aResponse["datos"] = $objDB->getQuery($sql);
        } else {
            $sql = $sqlBase . " ORDER BY id_especie ASC";
            $aResponse["datos"] = $objDB->getQuery($sql);
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Consulta realizada";
        $objDB->close();
        return $aResponse;
    }
    

    public function insert($xdatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null) {
            return ["estado" => "Error", "mensaje" => "JSON invalido. Revisa el cuerpo de la peticion."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();

        // Llamada al procedimiento almacenado insert_observacion
        $stmt = $conn->prepare("CALL insert_observacion(?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            $db->close();
            return ["estado" => "ERROR", "mensaje" => $conn->error];
        }

        $stmt->bind_param("sisdsi",
            $aDatos["fecha"],
            $aDatos["cantidad_ejemplares"],
            $aDatos["comportamiento_observado"],
            $aDatos["inversion"],
            $aDatos["nombre_comun"],
            $aDatos["cod_postal"]
        );

               $ok = $objDB->executePrepared($stmt);

        $aResponse = [];
        if ($ok) {
            $aResponse["estado"] = "success";
            $aResponse["mensaje"] = "La especie de araña se dio de alta satisfactoriamente";
            $aResponse["datos"] = ["insert_id" => $conn->insert_id];
        } else {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $conn->error;
        }

        $stmt->close();
        $objDB->close();
        return $aResponse;
    }

    public function update($xDatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null) {
            return ["estado" => "Error", "mensaje" => "JSON invalido."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();

        $stmt = $conn->prepare("CALL update_observacion(?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            $db->close();
            return ["estado" => "ERROR", "mensaje" => $conn->error];
        }

        $stmt->bind_param("isisdsi",
            $aDatos["id_observacion"],          // i
            $aDatos["fecha"],                   // s
            $aDatos["cantidad_ejemplares"],     // i
            $aDatos["comportamiento_observado"],// s
            $aDatos["inversion"],               // d
            $aDatos["nombre_comun"],            // s
            $aDatos["cod_postal"]               // i
        );


        $ok = $objDB->executePrepared($stmt);
        $aResponse = [];
        if ($ok) {
            $aResponse["estado"] = "success";
            $aResponse["mensaje"] = "La especie de araña se actualizo satisfactoriamente";
        } else {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $conn->error;
        }

        $stmt->close();
        $objDB->close();
        return $aResponse;
    }

    public function delete($xDatos) {
        $aDatos = json_decode($xDatos, true);

        if ($aDatos === null || !isset($aDatos["id_especie"])) {
            return ["estado" => "Error", "mensaje" => "JSON invalido o id_especie faltante."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $db->getConnection();

        $stmt = $conn->prepare("DELETE FROM especie_arana WHERE id_especie = ?");
        $id = intval($aDatos["id_especie"]);
        $stmt->bind_param("i", $id);

        $ok = $objDB->executePrepared($stmt);
        $aResponse = [];
        if ($ok) {
            $aResponse["estado"] = "success";
            $aResponse["mensaje"] = "La especie de araña se elimino satisfactoriamente";
        } else {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $conn->error;
        }

        $stmt->close();
        $objDB->close();
        return $aResponse;
    }
       
}
?>
