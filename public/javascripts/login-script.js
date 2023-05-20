window.onload = function () {

    const userid = document.getElementById("id-login");
    const userpwd = document.getElementById("pwd-login");
    const submit = document.getElementById("submit-login");
    const botslist = document.getElementById("bots-list");


    submit.addEventListener('click', (e) => {
        let id = userid.value;
        let pwd = userpwd.value;
        if (id !== "") {
            if (pwd !== "") {
                fetchData('/chatbot/api/v1/users', 'POST', {
                    id: id,
                    pwd: pwd
                }).then((rawResponse) => {
                    switch (rawResponse.status) {
                        case 404:
                            alert("USER NOT FOUND");
                            break;
                        case 500:
                            alert("SERVER ERROR");
                            break;
                        default:
                            rawResponse.json().then((json) => {
                                showHome(json);
                            });
                    }
                })/*
                const rawResponse = await fetchData('/chatbot/api/v1/users', 'POST', {
                    id: id,
                    pwd: pwd
                });
                switch (rawResponse.status) {
                    case 404:
                        alert("USER NOT FOUND");
                        break;
                    case 500:
                        alert("SERVER ERROR");
                        break;
                    default:
                        showHome(await rawResponse.json());
                }*/
            } else
                alert("Missing password")
        } else
            alert("Missing ID");
    });

    /**
     * Set page to home configuration
     * @param {any} data
     */
    function showHome(data) {
        clearLogin();
        clearHTMLElementByID('bots-creation');
        clearHTMLElementByID('chat');
        setCredentials();
        enableBotCreation(data.personalities);
        refreshBots(data.bots, botslist);
    }

    function clearLogin() {
        userid.value = "";
        userpwd.value = "";
    }

    function setCredentials(data) {
        document.getElementById('user-id-value').innerText = data.id;
        document.getElementById('user-pwd-value').innerText = data.pwd;
    }

    function enableBotCreation(data) {
        for (const personality of data) {
            let option = document.createElement('option');
            option.value = personality;
            option.innerText = personality;
            document.getElementById('new-bot-personality').appendChild(option);
        }
        document.getElementById('bots-creation').className = 'visible';
    }

}