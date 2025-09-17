class APIs {
    async getFromAPI(xURL, xfilter = "") {
        try {
            let url = xURL;
            if (xfilter !== "") {
                url = `${url}?filter=${encodeURIComponent(xfilter)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Error en la API");
            return await response.json();
        } catch (error) {
            console.error("Error en getFromAPI:", error);
            return [];
        }
    }

    async call(xurl, xargs = {}, xmethod = "GET", body = false) {
        try {
            let options = { method: xmethod };

            if (body) {
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify(xargs);
            } else if (Object.keys(xargs).length > 0) {
                xurl += "?" + new URLSearchParams(xargs).toString();
            }

            const response = await fetch(xurl, options);
            if (!response.ok) throw new Error("Error en la API");
            return await response.json();
        } catch (error) {
            console.error("Error en call:", error);
            return null;
        }
    }
}
export default APIs;