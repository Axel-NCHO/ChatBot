window.onload = function () {

    let botslist = document.getElementById('bots-list');
    let userid = document.getElementById("user-id-value");
    let userpwd = document.getElementById("user-pwd-value");
    let botname = document.getElementById("new-bot-name");
    let botpersonality = document.getElementById("new-bot-personality");
    let submit = document.getElementById("submit-bot-creation");


    submit.addEventListener('click', async (e) => {
        if (e.button === 0) {   // left click
            let id = userid.innerText;
            let pwd = userpwd.innerText;
            let name = botname.value;
            let personality = botpersonality.value;
            if (name !== "") {
                if (personality !== "") {
                    const rawResponse = await fetchData('/chatbot/api/v1/bots', 'POST', {
                        id: id,
                        pwd: pwd,
                        name: name,
                        personality: personality
                    });
                    switch (rawResponse.status) {
                        case 404:
                            alert("RESOURCE NOT FOUND");
                            break;
                        case 500:
                            alert("SERVER ERROR");
                            break;
                        default:
                            alert(`CREATION COMPLETED. ID: ${id}`);
                            refreshBots(rawResponse.json().bots, botslist);
                    }
                } else
                    alert("Missing personality");
            } else
                alert("Missing bot name")
        }
    });
}