class APIs {
    /**
     * @param {string} xurl URL de la API
     * @param {string} xargs Parámetros que recibe la API.
     * @param {string} xmethod Método que soporta la API: GET, POST, PUT, DELETE, etc.
     * @param {function} xcallback Función callback
     * @param {boolean} body Indica si el JSON se pasa por body. Por defecto false lo pasa por URL.
     */
    async call(xurl, xargs, xmethod, xcallback, body = false) {
        if (body) {
            fetch(xurl, {
                method: xmethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(xargs)
            })
            .then(xresponse => xresponse.json())
            .then(xdata => {
                xcallback(xdata);
            });
        } else {
            let url = xurl + "?" + xargs;
            fetch(url, { method: xmethod })
            .then(xresponse => xresponse.json())
            .then(xdata => {
                xcallback(xdata);
            });
        }
    }
}
export default APIs;