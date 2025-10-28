<?php
require_once(__DIR__ . "/../includes/database.inc.php");

class ObservacionModel {
    
    /**
     * Obtiene una o todas las observaciones con los detalles de especie y centro necesarios para el frontend.
     * @param string $xfilter JSON con el filtro (ej: {"filter": "id_observacion = 5"}) o vacío para todas.
     * @return array
     */
    public function get($xfilter = "") {
        $aFilter = json_decode($xfilter, true);
        $objDB = new DataBase();
        
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $sqlBase = "
            SELECT 
                o.id_observacion, 
                DATE_FORMAT(o.fecha, '%d/%m/%Y') AS fecha, 
                o.cantidad_ejemplares, 
                o.comportamiento_observado, 
                o.inversion,
                ea.nombre_comun, 
                ci.nombre_centro

            FROM observacion o
            JOIN especie_arana ea ON o.id_especie = ea.id_especie
            JOIN centro_investigacion ci ON o.id_centro = ci.id_centro
            
        ";

        $sql = $sqlBase;
        

        if (is_array($aFilter) && !empty($aFilter["filter"])) {
            
            $sql .= " WHERE " . $aFilter["filter"];
            $aResponse["datos"] = $objDB->getQuery($sql);
            
            // Si es para edición, se espera 1 solo registro
            if (!empty($aResponse["datos"])) {
                 // Devolver el primer elemento directamente si se espera uno solo
                 $aResponse["datos"] = [$aResponse["datos"][0]]; 
            }
        } 
        
        //Obtener TODAS las observaciones (para la tabla principal)
        else {
            $sql .= " ORDER BY o.id_observacion ASC";
            $aResponse["datos"] = $objDB->getQuery($sql);
        }

        $aResponse["estado"] = "success";
        $aResponse["mensaje"] = "Consulta realizada";
        $objDB->close();
        return $aResponse;
    }
    
    /**
     * Inserta una nueva observación usando el SP 'insert_observacion'.
     * @param string $xdatos JSON con los datos.
     * @return array
     */
    public function insert($xdatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null) {
            return ["estado" => "Error", "mensaje" => "JSON inválido. Revisa el cuerpo de la petición."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();

        try {
            
            $stmt = $conn->prepare("CALL insert_observacion(?, ?, ?, ?, ?, ?)");
            
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $conn->error);
            }

            
            $stmt->bind_param("sisdss", 
                $aDatos["fecha"],
                $aDatos["cantidad_ejemplares"],
                $aDatos["comportamiento_observado"],
                $aDatos["inversion"],
                $aDatos["nombre_comun"],
                $aDatos["nombre_centro"]
            );

            
            $ok = $stmt->execute();

            
            $aResponse = [];
            if ($ok) {
                $result = $stmt->get_result(); 
                
                if ($result && $row = $result->fetch_assoc()) {
                   
                    $sp_message = $row['result']; 
                    
                    if (strpos($sp_message, 'ERROR') !== false) {
                        $aResponse["estado"] = "Error";
                    } else {
                        $aResponse["estado"] = "success";
                    }
                    $aResponse["mensaje"] = $sp_message;
                    
                } else {
                    $aResponse["estado"] = "success";
                    $aResponse["mensaje"] = "Observación guardada con exito.";
                }
                
            } else {
                
                $aResponse["estado"] = "Error";
         
                $aResponse["mensaje"] = "Error de ejecución: " . $stmt->error; 
            }

            $stmt->close();

        } catch (Exception $e) {
            $aResponse = ["estado" => "Error", "mensaje" => $e->getMessage()];
        }
        
        $objDB->close();
        return $aResponse;
    }

    /**
     * Actualiza una observación existente usando el SP 'update_observacion'.
     * @param string $xdatos JSON con los datos.
     * @return array
     */
    public function update($xdatos) {
        $aDatos = json_decode($xdatos, true);
        if ($aDatos === null) {
            return ["estado" => "Error", "mensaje" => "JSON inválido."];
        }
        
        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();

        try {
        
            $stmt = $conn->prepare("CALL update_observacion(?, ?, ?, ?, ?, ?, ?)");
            
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $conn->error);
            }

           
            $stmt->bind_param("isisdss", 
                $aDatos["id_observacion"],
                $aDatos["fecha"],
                $aDatos["cantidad_ejemplares"],
                $aDatos["comportamiento_observado"],
                $aDatos["inversion"],
                $aDatos["nombre_comun"],
                $aDatos["nombre_centro"]
            );

        $stmt->execute();

        $result = $stmt->get_result(); 

        if ($result && $row = $result->fetch_assoc()) {
           
            $mensaje = $row['result'] ?? "Observación actualizada, pero mensaje de SP no devuelto.";
            
            
            if (strpos($mensaje, 'ERROR SQL') !== false || strpos($mensaje, 'Fallo') !== false) {
                 $aResponse = ["estado" => "Error", "mensaje" => $mensaje];
            } else {
                 $aResponse = ["estado" => "success", "mensaje" => $mensaje];
            }
        } else {
          
            $aResponse = ["estado" => "success", "mensaje" => "Observación actualizada exitosamente (Respuesta directa del SP no disponible)."];
        }

       
        while ($conn->more_results() && $conn->next_result()) { }
        
        $stmt->close();

    } catch (Exception $e) {
        
        $aResponse = ["estado" => "Error", "mensaje" => "Error de servidor (PHP): " . $e->getMessage()];
    }
    
    $objDB->close();
    return $aResponse;
}

    /**
     * Elimina una observación existente usando el SP 'delete_observacion'.
     * @param string $xdatos JSON con el id_observacion.
     * @return array
     */
    public function delete($xdatos) {
        $aDatos = json_decode($xdatos, true);

        
        if ($aDatos === null || !isset($aDatos["id_observacion"])) {
            return ["estado" => "Error", "mensaje" => "JSON inválido o id_observacion faltante."];
        }

        $objDB = new DataBase();
        if (!$objDB->getEstadoConexion()) {
            return ["estado" => "Error", "mensaje" => $objDB->getMensajeError()];
        }

        $conn = $objDB->getConnection();

        try {
            
            $stmt = $conn->prepare("CALL delete_observacion(?)"); 
            
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . $conn->error);
            }
            
            $id = intval($aDatos["id_observacion"]);
            $stmt->bind_param("i", $id);

            $ok = $objDB->executePrepared($stmt);
            $aResponse = [];
            
            if ($ok) {
              
                $aResponse["estado"] = "success";
                $aResponse["mensaje"] = "Observación eliminada satisfactoriamente";
            } else {
                
                $aResponse["estado"] = "Error";
                $aResponse["mensaje"] = "Error de ejecución: " . $conn->error;
            }

            $stmt->close();
        } catch (Exception $e) {
            $aResponse = ["estado" => "Error", "mensaje" => $e->getMessage()];
        }
        
        $objDB->close();
        return $aResponse;
    }
       
}
?>