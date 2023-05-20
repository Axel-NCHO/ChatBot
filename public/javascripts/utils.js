/**
 * Fetch data from url
 * @param {string} url
 * @param {string} method
 * @param {Object} payload
 * @returns {Promise<Response>}
 */
async function fetchData(url, method, payload) {
    return await fetch(url,
        {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: payload
        });
}

/**
 *
 * @param {Object} bots
 * @param {HTMLElement} botslist
 */
function refreshBots(bots, botslist) {
    if (bots.length !== 0) {
        for (const bot of bots) {
            let box = document.createElement('div');
            box.id = bot.name;
            box.className = 'bot';
            box.innerHTML = `
                    <p>${bot.name}</p>
                    <p>${bot.personality}</p>`;
            botslist.appendChild(box);
        }
    } else
        botslist.className = "visible";
        botslist.innerHTML = `<p>You don't have any bots</p>`;
}

/**
 * Clear an HTMLElement
 * @param {string} id
 */
function clearHTMLElementByID(id) {
    document.getElementById(id).className = 'invisible';
}