<?php
class DataBase {
    private $objDB;
    private $conexionOK;
    private $errorMessage;

    public function getEstadoConexion() {
        return $this->conexionOK;
    }

    public function getMensajeError() {
        return $this->errorMessage;
    }

    function __construct() {
        $this->objDB = new mysqli(HOST,USER,PASSWORD,DATABASE);
        if ($this->objDB->connect_errno) {
            $this->errorMessage = "Error de conexión (" . $this->objDB->connect_errno . ") " . $this->objDB->connect_error;
            $this->conexionOK = false;
        } else {
            $this->conexionOK = true;
            $this->objDB->set_charset("utf8mb4");
        }
    }

    // Devuelve el objeto mysqli para usar prepared statements
    public function getConnection() {
        return $this->objDB;
    }

    // Escape (por si lo necesitas)
    public function escape($str) {
        return $this->objDB->real_escape_string($str);
    }

    // Ejecuta query y retorna array asociativo
    public function getQuery($xsql) {
        $this->objDB->real_query($xsql);
        $resultado = $this->objDB->use_result();
        return $resultado->fetch_all(MYSQLI_ASSOC);
    }

    // Ejecuta prepared SELECT y retorna resultados
    // $stmt: mysqli_stmt preparado
    public function getPrepared($stmt) {
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // Ejecuta prepared INSERT/UPDATE/DELETE
    public function executePrepared($stmt) {
        $ok = $stmt->execute();
        return $ok;
    }

    public function execute($xsql) {
        if (!$this->objDB->query($xsql)) {
            return false;
        } else {
            return true;
        }
    }

    public function close() {
        $this->objDB->close();
    }
}
?>
