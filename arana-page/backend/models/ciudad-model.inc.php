<?php 

class CiudadModel {

    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter, true);
        $aResponse = [];
        $sql = "SELECT
                    *
                FROM 
                    ciudad AS c ";

        if (strcmp($aFilter["filter"], "") != 0)
            $sql .= " WHERE " . $aFilter["filter"] . " ";

        $sql .= " ORDER BY id_ciudad ASC ";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            $aResponse["estado"] = "ERROR";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Ciudades cargadas correctamente";
        $aResponse["datos"] = $objDB->getQuery($sql);
        
        $objDB->close();
        return $aResponse;
    }

}
?>
