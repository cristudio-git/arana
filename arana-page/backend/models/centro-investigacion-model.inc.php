<?php

class CentroInvestigacionModel {

    /**
     * get
     * Permite obtener todos los registros
     * de la tabla centro_investigacion
     * @param string $xfilter Parámetro opcional 
     * que define el filtro a aplicar
     * @return array
     */

    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter,true);
        $aResponse = [];
        $sql = "SELECT * FROM centro_investigacion AS ci";

        if (strcmp($aFilter["filter"], "") != 0)
            $sql .= " WHERE " . $aFilter["filter"] . " ";

        $sql .= " ORDER BY id_centro ASC";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            $aResponse["estado"] = "ERROR";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Centro de investigación encontrado con exito";
        $aResponse["datos"] = $objDB->getQuery($sql);

        $objDB->close();
        return $aResponse;

    }

    
    /**
     * insert
     * Permite insertar un registro en la tabla centro_investigacion
     * @param string $aDatos Array asociativo con los datos a insertar
     * @return array Resultado de la ejecución
     */

    public function insert($xdatos) {
        $aDatos = json_decode($xdatos, true);
        $aResponse = [];

        if ($aDatos === null) {
            return [
                "estado" => "Error",
                "mensaje" => "JSON invalido. Revisa el cuerpo de la peticion."
            ];
        }           

        $sql = "CALL insert_centro_investigacion(
                '" . $aDatos["nombre_centro"] . "',
                '" . $aDatos["cod_postal"] . "',
                '" . $aDatos["direccion"] . "',
                '" . $aDatos["telefono"] . "',
                '" . $aDatos["dni_director"] . "'
                )";
        // var_dump($sql);
        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "El centro de investigación se dio de alta satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        
        $objDB->close();
        return $aResponse;
    }

    /**
     * update
     * Permite actualizar un registro de la tabla especie_arana.
     * @param array $aDatos
     * @return array
     */
    public function update($xdatos) {
        $aDatos = json_decode($xdatos, true);
        $aResponse = [];
        $sql = "UPDATE
                    centro_investigacion
                SET
                    nombre_centro = '" . $aDatos["nombre_centro"] . "',
                    id_ciudad = '" . $aDatos["id_ciudad"] . "',
                    direccion = '" . $aDatos["direccion"] . "',
                    telefono = '" .$aDatos["telefono"] ."',
                    id_director = '" .$aDatos["id_director"] ."'
                WHERE
                    centro_investigacion.id_centro = ". $aDatos["id_centro"];
        
      
        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "El centro de investigación se actualizo satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        $objDB->close();
        return $aResponse;

    }

    public function delete($xdatos) {
        $aDatos = json_decode($xdatos, true);
        $aResponse = [];

        $sql = "CALL delete_centro_investigacion('" . $aDatos['nombre_centro'] . "')";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "El centro de investigación se elimino satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        $objDB->close();
        return $aResponse;
    }

}

?>