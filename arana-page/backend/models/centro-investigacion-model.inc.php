<?php

class CentroInvestigacionModel {


    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter, true);
        $aResponse = [];

        // Consulta con JOIN para traer nombre de ciudad y director
        $sql = "SELECT 
                    ci.id_centro,
                    ci.nombre_centro,
                    ci.direccion,
                    ci.telefono,
                    c.nombre_ciudad,
                    d.nombre_director
                FROM 
                    centro_investigacion AS ci
                LEFT JOIN ciudad AS c ON ci.id_ciudad = c.id_ciudad
                LEFT JOIN director AS d ON ci.id_director = d.id_director ";

        
        if (isset($aFilter['filter']) && trim($aFilter['filter']) !== '') {
            $sql .= " WHERE " . $aFilter['filter'] . " ";
        }

        $sql .= " ORDER BY ci.id_centro ASC ";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            return [
                "estado" => "ERROR",
                "mensaje" => $objDB->getMensajeError(),
                "datos"   => []
            ];
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "";
        $aResponse["datos"]   = $objDB->getQuery($sql);

        $objDB->close();
        return $aResponse;
    }


    public function insert($xDatos) {
        $aDatos = json_decode($xDatos, true);
        $aResponse = [];

        $sql = "CALL insert_centro_investigacion(
                    '" . addslashes($aDatos["nombre_centro"]) . "',
                    '" . addslashes($aDatos["nombre_ciudad"] ?? '') . "',
                    '" . addslashes($aDatos["direccion"]) . "',
                    '" . addslashes($aDatos["telefono"]) . "',
                    '" . addslashes($aDatos["nombre_director"]) . "'
                )";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            return [
                "estado"  => "ERROR",
                "mensaje" => $objDB->getMensajeError(),
                "datos"   => []
            ];
        }

        $result = $objDB->execute($sql);

        $aResponse["estado"]  = "success";
        $aResponse["mensaje"] = "El centro de investigación se dió de alta satisfactoriamente";
        $aResponse["datos"]   = $result;

        $objDB->close();
        return $aResponse;
    }

   
    public function update($xDatos) {
        $aDatos = json_decode($xDatos, true);
        $aResponse = [];

        if (!isset($aDatos["id_centro"])) {
            return [
                "estado"  => "ERROR",
                "mensaje" => "Falta el ID del centro para actualizar",
                "datos"   => []
            ];
        }


        $id_centro       = intval($aDatos["id_centro"]);
        $nombre_centro   = addslashes(trim($aDatos["nombre_centro"] ?? ""));
        $nombre_ciudad   = addslashes(trim($aDatos["nombre_ciudad"] ?? ""));
        $direccion       = addslashes(trim($aDatos["direccion"] ?? ""));
        $telefono        = addslashes(trim($aDatos["telefono"] ?? ""));
        $nombre_director = addslashes(trim($aDatos["nombre_director"] ?? ""));

        $sql = "CALL update_centro_investigacion(
                    $id_centro,
                    '$nombre_centro',
                    '$nombre_ciudad',
                    '$direccion',
                    '$telefono',
                    '$nombre_director'
                )";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            return [
                "estado"  => "ERROR",
                "mensaje" => $objDB->getMensajeError(),
                "datos"   => []
            ];
        }

        $result = $objDB->execute($sql);

        if ($result === false) {
            $aResponse["estado"]  = "ERROR";
            $aResponse["mensaje"] = "No se pudo actualizar el centro de investigación";
        } else {
            $aResponse["estado"]  = "success";
            $aResponse["mensaje"] = "El centro de investigación se actualizó correctamente";
            $aResponse["datos"]   = $result;
        }

        $objDB->close();
        return $aResponse;
    }


    public function delete($xDatos) {
        $aDatos = json_decode($xDatos, true);
        $aResponse = [];

      
        if (!isset($aDatos["id_centro"]) || !is_numeric($aDatos["id_centro"])) {
            return [
                "estado"  => "ERROR",
                "mensaje" => "ID de centro inválido o no especificado.",
                "datos"   => []
            ];
        }

        $idCentro = intval($aDatos["id_centro"]);

        $sql = "DELETE FROM centro_investigacion WHERE id_centro = $idCentro";

        $objDB = new DataBase();


        if (!$objDB->getEstadoConexion()) {
            return [
                "estado"  => "ERROR",
                "mensaje" => $objDB->getMensajeError(),
                "datos"   => []
            ];
        }

        $result = $objDB->execute($sql);

        if ($result) {
            $aResponse["estado"]  = "success";
            $aResponse["mensaje"] = "El centro de investigación se eliminó satisfactoriamente.";
        } else {
            $aResponse["estado"]  = "ERROR";
            $aResponse["mensaje"] = "No se pudo eliminar el registro o no existe el ID especificado.";
        }

        $aResponse["datos"] = $result;
        $objDB->close();
        return $aResponse;
    }
}

?>
