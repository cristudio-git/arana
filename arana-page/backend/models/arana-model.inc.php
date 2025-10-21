<?php
require_once(__DIR__ . "/../includes/database.inc.php");



class AranaModel {
    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter,true);
        $aResponse = [];
        $sqlBase = "SELECT * FROM especie_arana";

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "ERROR", "mensaje" => $objDB->getMensajeError()];
        }

        // condición SQL segura (se recomienda filtrar por id en el frontend)
        if (is_array($aFilter) && !empty($aFilter["filter"])) {
            //  frontend pasa algo asi (ej: "id_especie = 3")
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
        $stmt = $conn->prepare("INSERT INTO especie_arana (nombre_cientifico, nombre_comun, familia, habitat, peligrosidad) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss",
            $aDatos['nombre_cientifico'],
            $aDatos['nombre_comun'],
            $aDatos['familia'],
            $aDatos['habitat'],
            $aDatos['peligrosidad']
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

    public function update($xdatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null) {
            return ["estado" => "Error", "mensaje" => "JSON invalido."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();
        $stmt = $conn->prepare("UPDATE especie_arana SET nombre_cientifico = ?, nombre_comun = ?, familia = ?, habitat = ?, peligrosidad = ? WHERE id_especie = ?");
        $stmt->bind_param("sssssi",
            $aDatos["nombre_cientifico"],
            $aDatos["nombre_comun"],
            $aDatos["familia"],
            $aDatos["habitat"],
            $aDatos["peligrosidad"],
            $aDatos["id_especie"]
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

    public function delete($xdatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null || !isset($aDatos["id_especie"])) {
            return ["estado" => "Error", "mensaje" => "JSON invalido o id_especie faltante."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();
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
