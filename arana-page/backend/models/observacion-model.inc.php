<?php 

class ObservacionModel {


    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter,true);
        $aResponse = [];
        $sql = "SELECT
                    *
                FROM 
                    observacion " ;

        if (strcmp($aFilter["filter"], "") !=0 )
            $sql .= " WHERE " . $aFilter["filter"] ." ";

        

        $sql .= " ORDER BY id_observacion DESC ";

        $objDB = new DataBase();

        if (!$objDB->getEstadoConexion()) {
            $aResponse["estado"] = "ERROR";
            $aResponse["mensaje"] = $objDB->getMensajeError();
            return $aResponse;
        }
                    
        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "";
        $aResponse["datos"] = $objDB->getQuery($sql);
        $objDB->close();
        return $aResponse;
    }

    

    public function insert($xDatos) {
        $aDatos = json_decode($xDatos, true);
        $aResponse = []; 

        $sql = "CALL insert_observacion ( 

                    '" . $aDatos["fecha"] . "' ,
                    '" . $aDatos["cantidad_ejemplares"] . "',
                    '" . $aDatos["comportamiento_observado"] . "' ,
                    '" . $aDatos["inversion"] . "' ,
                    '" . $aDatos["nombre_comun"] . "' ,
                    '" . $aDatos["nombre_centro"] ."')";

        $objDB = new DataBase(); 

        if (!$objDB->getEstadoConexion()) { 
            $aResponse["estado"] = "ERROR"; 
            $aResponse["mensaje"] = $objDB->getMensajeError(); 
            return $aResponse;
        } 

        $aResponse["estado"] = "success"; 
        $aResponse["mensaje"] = "La observacion se dió de alta satisfactoriamente"; 
        $aResponse["datos"] = $objDB->execute($sql); 

        $objDB->close(); 
        return $aResponse; 
    } 
    

    public function update($xDatos) { 
        $aDatos = json_decode($xDatos, true);
        $aResponse = []; 

        $sql = "CALL update_observacion(
                    '" . $aDatos["id_observacion"] . "',
                    '" . $aDatos["fecha"] . "',
                    '" . $aDatos["cantidad_ejemplares"] . "',
                    '" . $aDatos["comportamiento_observado"] . "',
                    '" . $aDatos["inversion"] . "',
                    '" . $aDatos["nombre_comun"] . "',
                    '" . $aDatos["nombre_centro"] . "')";

        $objDB = new DataBase(); 

        if (!$objDB->getEstadoConexion()) { 
            $aResponse["estado"] = "ERROR"; 
            $aResponse["mensaje"] = $objDB->getMensajeError(); 
            return $aResponse; 
        } 

        $aResponse["estado"] = "success"; 
        $aResponse["mensaje"] = "La observacion se actualizó satisfactoriamente"; 
        $aResponse["datos"] = $objDB->execute($sql); 

        $objDB->close(); 

        return $aResponse; 
    }


    public function delete($xDatos) { 
        $aDatos = json_decode($xDatos, true);
        $aResponse = []; 


        $sql = "CALL delete_observacion(
                    '" . $aDatos["id_observacion"] . "')";

        $objDB = new DataBase(); 

        if (!$objDB->getEstadoConexion()) { 
            $aResponse["estado"] = "ERROR"; 
            $aResponse["mensaje"] = $objDB->getMensajeError(); 
            return $aResponse; 
        } 

        $aResponse["estado"] = "success"; 
        $aResponse["mensaje"] = "La observacion se elimino satisfactoriamente"; 
        $aResponse["datos"] = $objDB->execute($sql); 

        $objDB->close(); 

        return $aResponse; 
    } 

} 
?>