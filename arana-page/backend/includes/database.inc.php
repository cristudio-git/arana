<?php


/**
 * Clase: DataBase
 * Descripción:
 * Esta clase permite manejar el acceso a datos
 */

class DataBase {
    private $objDB;
    private $conexionOK;
    private $errorMessage;

    /**
     * getEstadoConexion
     * Indica si la conexión fue satisfactoria o no.
     * @return bool true: conexión satisfactoria | false: Ocurrió un fallo.
     */
    public function getEstadoConexion() {
        return $this->conexionOK;
    }

    /**
     * getMensajeError
     * Obtiene el mensaje de error en caso de un fallo.
     * @return string
     */
    public function getMensajeError() {
        return $this->errorMessage;
    }
    /**
    *__construct
    *Constructor de clase
    *@return void
    */

    function __construct() {
        $this->objDB = new mysqli(HOST,USER,PASSWORD,DATABASE);
        if ($this->objDB->connect_errno) { // Devuelve el mensaje de error en texto
            $this->errorMessage = "Error de conexión ("
                . $this->objDB->connect_errno . ") "
                . $this->objDB->connect_error;
                $this->conexionOK = false;
        } else {
            //Indico que la conexión es correcta y establezco el
            //juego de caracteres a utf8.
            $this->conexionOK = true;
            $this->objDB->set_charset("utf8");

        }
    }

    /**
     * getQuery
     * Ejecuta una consulta SQL.
     * @param string $xsql Sentencia SQL
     * @return array Array asociativo con el conjunto de resultados.
     */

    public function getQuery($xsql) {
        $this->objDB->real_query($xsql);
        $resultado = $this->objDB->use_result();
        return $resultado->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * execute
     * Permite ejecutar una sentencia sql.
     * @param string $xsql
     * @return bool true: Ejecución correcta | false: error al ejecutar
     */
    public function execute($xsql) {
        if (!$this->objDB->query($xsql)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * close
     * Cierra la conexión establecida con la base de datos
     * @return void
     */
    public function close() {
        $this->objDB->close();
    }

}


?>