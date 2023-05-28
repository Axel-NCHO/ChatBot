/**
 * Fetch data from url
 * @param {string} url
 * @param {string} method
 * @param {Object} body
 * @returns {Promise<Response>}
 */
async function fetchData(url, method, body) {
    let payload = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (body != null)
        payload.body = JSON.stringify(body);
    return await fetch(url, payload);
}