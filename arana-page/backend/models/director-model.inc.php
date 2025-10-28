<?php 

class DirectorModel {

    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter, true);
        $aResponse = [];
        $sql = "SELECT
                    *
                FROM 
                    director AS d ";

        if (strcmp($aFilter["filter"], "") != 0)
            $sql .= " WHERE " . $aFilter["filter"] . " ";

        $sql .= " ORDER BY id_director ASC ";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            $aResponse["estado"] = "ERROR";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Directores cargados correctamente";
        $aResponse["datos"] = $objDB->getQuery($sql);
        
        $objDB->close();
        return $aResponse;
    }

}
?>
