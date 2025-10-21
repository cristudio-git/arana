class APIs {
    async call(xurl, xargs = "", xmethod = "GET", body = false, options = {}) {
        const headers = { 'Content-Type': 'application/json' };
        const fetchOptions = {
            method: xmethod.toUpperCase(),
            headers,
        };

        if (body) {
            fetchOptions.body = JSON.stringify(xargs);
        } else {
            
            if (typeof xargs === 'object' && xargs !== null) {
                const qs = new URLSearchParams(xargs).toString();
                xurl = xurl + (xurl.includes('?') ? '&' : '?') + qs;
            } else if (typeof xargs === 'string' && xargs !== '') {
                xurl = xurl + (xurl.includes('?') ? '&' : '?') + xargs;
            }
        }

        
        const controller = new AbortController();
        const timeout = options.timeout || 10000;
        const id = setTimeout(() => controller.abort(), timeout);
        fetchOptions.signal = controller.signal;

        try {
            const resp = await fetch(xurl, fetchOptions);
            clearTimeout(id);
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`HTTP ${resp.status}: ${text}`);
            }
            const json = await resp.json();
            return json;
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    // Wrappers
    get(url, params = {}) { return this.call(url, params, "GET", false); }
    post(url, body = {}) { return this.call(url, body, "POST", true); }
    put(url, body = {}) { return this.call(url, body, "PUT", true); }
    delete(url, body = {}) { return this.call(url, body, "DELETE", true); }
}

export default APIs;
