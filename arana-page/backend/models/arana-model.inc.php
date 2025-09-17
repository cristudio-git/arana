<?php

class AranaModel {

    /**
     * get
     * Permite obtener todos los registros
     * de la tabla arana
     * @param string $xfilter Parámetro opcional 
     * que define el filtro a aplicar
     * @return array
     */

    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter,true);
        $aResponse = [];
        $sql = "SELECT * FROM especie_arana";

        if (strcmp($aFilter["filter"], "") != 0)
            $sql .= " WHERE " . $aFilter["filter"] . " ";

        $sql .= " ORDER BY id_especie ASC";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            $aResponse["estado"] = "ERROR";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Araña encontrada con exito";
        $aResponse["datos"] = $objDB->getQuery($sql);

        $objDB->close();
        return $aResponse;

    }

    
    /**
     * insert
     * Permite insertar un registro en la tabla arana
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

        $sql = "INSERT INTO especie_arana(
		            nombre_cientifico, 
                    nombre_comun,
                    familia,
                    habitat,
                    peligrosidad)
	            VALUES(
		            '" . $aDatos['nombre_cientifico'] ."',
                    '" . $aDatos['nombre_comun'] ."',
                    '" . $aDatos['familia'] ."',
                    '" . $aDatos['habitat'] ."',
                    '" . $aDatos['peligrosidad'] ."'
                    )";
        //var_dump($sql);
        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "La especie de araña se dio de alta satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        
        $objDB->close();
        return $aResponse;
    }

    /**
     * update
     * Permite actualizar un registro de la tabla arana.
     * @param array $aDatos
     * @return array
     */
    public function update($xdatos) {
        $aDatos = json_decode($xdatos, true);
        $aResponse = [];
        $sql = "UPDATE
                    especie_arana
                SET
                    nombre_cientifico = '" . $aDatos["nombre_cientifico"] . "',
                    nombre_comun = '" . $aDatos["nombre_comun"] . "',
                    familia = '" .$aDatos["familia"] ."',
                    habitat = '" .$aDatos["habitat"] ."',
                    peligrosidad = '" .$aDatos["peligrosidad"] ."'
                WHERE
                    especie_arana.id_especie = ". $aDatos["id_especie"];
        
      
        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "La especie de araña se actualizo satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        $objDB->close();
        return $aResponse;

    }

    public function delete($xdatos) {
        $aDatos = json_decode($xdatos, true);
        $aResponse = [];

        $sql = "CALL delete_especie_arana('" . $aDatos['nombre_cientifico'] . "')";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion() ) {
            $aResponse["estado"] = "Error";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "La especie de araña se elimino satisfactoriamente";
        $aResponse["datos"] = $objDB->execute($sql);
        $objDB->close();
        return $aResponse;
    }

}

?>