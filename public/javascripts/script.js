window.onload = function () {

    const useridlogin = document.getElementById("id-login");
    const userpwdlogin = document.getElementById("pwd-login");
    const submit_login = document.getElementById("submit-login");

    const useridsignup = document.getElementById("id-signup");
    const userpwdsignup = document.getElementById("pwd-signup");
    const submit_signup = document.getElementById("submit-signup");

    const botscontainer = document.getElementById("bots-list-container");
    const botslist = document.getElementById("bots-list");

    let submit_creation = document.getElementById("submit-bot-creation");
    let submit_modif = document.getElementById("submit_bot_modif");

    let chat = document.getElementById('chat');
    let submit_selection = document.getElementById("submit-bot-selection");
    let submit_delete = document.getElementById("submit-bot-to-delete");

    const chat_history = document.getElementById("chat-history");
    const user_input = document.getElementById("user-input-chat");

    const logout = document.getElementById("logout");


    submit_login.addEventListener('click', handleLogin);
    submit_signup.addEventListener('click', handleSignup);

    submit_creation.addEventListener('click', handleCreationAndModif);
    submit_creation.METHOD = 'POST';

    submit_modif.addEventListener('click', handleCreationAndModif);
    submit_modif.METHOD = 'PATCH';

    submit_selection.addEventListener('click', handleSelection);

    submit_delete.addEventListener('click', handleDelete);

    user_input.addEventListener('keypress', handleChat);

    logout.addEventListener('click', handleLogout);

    async function handleLogin() {
        let id = useridlogin.value;
        let pwd = userpwdlogin.value;
        if (id !== "") {
            if (pwd !== "") {
                let rawResponse = await fetchData('/chatbot/api/v1/users/auth', 'POST', {
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
                        let json = await rawResponse.json();
                        json.pwd = pwd;
                        showHome(json, true);
                }
            } else
                alert("Missing password")
        } else
            alert("Missing ID");
    }

    async function handleSignup() {
        let id = useridsignup.value
        let pwd = userpwdsignup.value;
        if (id !== "") {
            if (pwd !== "") {
                const rawResponse = await fetchData('/chatbot/api/v1/users/', 'POST', {
                    id: id,
                    pwd: pwd
                });
                switch (rawResponse.status) {
                    case 400:
                        await alert("THIS USERNAME IS NOT AVAILABLE");
                        break;
                    case 404:
                        alert("RESOURCE NOT FOUND");
                        break;
                    case 500:
                        alert("SERVER ERROR");
                        break;
                    default:
                        alert(`REGISTRATION COMPLETED. ID: ${id}`);
                        let json = await rawResponse.json();
                        json.pwd = pwd;
                        showHome(json);
                }
            } else
                alert("Missing password")
        } else
            alert("Missing ID");
    }

    async function handleCreationAndModif(e) {
        if (e.button === 0) {   // left click
            let id = document.getElementById("user-id-value").innerText;
            let pwd = document.getElementById("user-pwd-value").innerText;
            let name = document.getElementById("new-bot-name").value;
            let personality = document.getElementById("new-bot-personality").value;
            if (name !== "") {
                if (personality !== "") {
                    const rawResponse = await fetchData('/chatbot/api/v1/bots', e.currentTarget.METHOD, {
                        id: id,
                        pwd: pwd,
                        name: name,
                        personality: personality
                    });
                    switch (rawResponse.status) {
                        case 400:
                            alert('YOU ALREADY CREATED A BOT WITH THIS NAME');
                            break;
                        case 404:
                            alert("RESOURCE NOT FOUND");
                            break;
                        case 500:
                            alert("SERVER ERROR");
                            break;
                        default:
                            clearCreate();
                            alert(`COMPLETED. ID: ${id}`);
                            let json = await rawResponse.json()
                            chat_history.innerHTML = '';
                            refreshBots(json.bots);
                    }
                } else
                    alert("Missing personality");
            } else
                alert("Missing bot name")
        }
    }

    async function handleSelection(e) {
        if (e.button === 0) {   // left click
            let id = document.getElementById("user-id-value").innerText;
            let pwd = document.getElementById("user-pwd-value").innerText;
            let name = document.getElementById("botname-selected").value;
            if (name !== "") {
                const rawResponse = await fetchData(`/chatbot/api/v1/chat/id=${id}&pwd=${pwd}&name=${name}`, 'GET');
                switch (rawResponse.status) {
                    case 404:
                        alert(`YOU DO NOT HAVE A BOT NAMED ${name}`);
                        break;
                    case 500:
                        alert("SERVER ERROR");
                        break;
                    default:
                        startChat(name);
                }
            } else
                alert("Missing bot name")
        }
    }

    async function handleChat(e) {
        if (e.key === 'Enter') {
            if (e.shiftKey)
                user_input.value = user_input.value + "\n";
            else {
                let id = document.getElementById("user-id-value").innerText;
                let pwd = document.getElementById("user-pwd-value").innerText;
                let name = document.getElementById("botname-current").innerText;
                let input_text = user_input.value;
                user_input.value = '';

                if (input_text !== "") {
                    const input = document.createElement('div');
                    input.innerHTML = `<p class="box">You:<br>${input_text}</p>`;
                    chat_history.appendChild(input);

                    const rawResponse = await fetchData(`/chatbot/api/v1/chat/response`, 'POST', {
                        id: id,
                        pwd: pwd,
                        name: name,
                        input: input_text
                    });
                    switch (rawResponse.status) {
                        case 404:
                            alert('RESOURCE NOT FOUND');
                            break;
                        case 500:
                            await alert('SERVER ERROR');
                            break;
                        default:
                            showReply(await rawResponse.json());
                    }
                }
            }
        }
    }

    async function handleDelete() {
        let id = document.getElementById("user-id-value").innerText;
        let pwd = document.getElementById("user-pwd-value").innerText;
        let name = document.getElementById("botname-to-delete").value;
        document.getElementById("botname-to-delete").value = "";

        if (name !== "") {
            let rawResponse = await fetchData("/chatbot/api/v1/bots", 'DELETE', {
                id: id,
                pwd: pwd,
                name: name
            });
            switch(rawResponse.status) {
                case 404:
                    alert(`YOU DO NOT HAVE A BOT NAMED ${name}`);
                    break;
                default:
                    let json = await rawResponse.json();
                    refreshBots(json.bots);
            }
        } else
            alert("Missing bot name");
    }

    async function handleLogout() {
        document.getElementById("user-id-value").innerText = "";
        document.getElementById("user-pwd-value").innerText = "";
        document.getElementById("botname-selected").innerText = "";
        document.getElementById("botname-current").innerText = "";
        document.getElementById("chat-history").innerHTML = "";
        document.getElementById("chat").className = "invisible";
        document.getElementById("bots-list-container").className = "invisible";
        document.getElementById("bots-creation").className = "invisible";
    }

    /**
     * Set page to home configuration
     * @param {any} data object containing needed data
     * @param {boolean} logged_in if true, show bot creation panel and refresh bots list
     */
    function showHome(data, logged_in=false) {
        clearLogin();
        clearSignup()
        document.getElementById("chat").className = 'invisible';
        setCredentials(data.id, data.pwd);
        if (logged_in) {
            enableBotCreation(data.personalities);
            refreshBots(data.bots);
        }
        enableLogOut();
    }

    /**
     * Clear login panel inputs
     */
    function clearLogin() {
        useridlogin.value = "";
        userpwdlogin.value = "";
    }

    /**
     * Clear signup panel inputs
     */
    function clearSignup() {
        useridsignup.value = "";
        userpwdsignup.value = "";
    }

    /**
     * Clear bot creation panel inputs
     */
    function clearCreate() {
        document.getElementById("new-bot-name").value = "";
        document.getElementById("new-bot-personality").selectedIndex = 0;
    }

    function setCredentials(id, pwd) {
        console.log(`id=${id} and pwd=${pwd}`)
        document.getElementById('user-id-value').innerText = id;
        document.getElementById('user-pwd-value').innerText = pwd;
    }

    function enableBotCreation(data) {
        document.getElementById('new-bot-personality').innerHTML = "";
        document.getElementById('new-bot-personality').innerHTML = `
            <option value="">--Choose a personality--</option>`;
        for (const personality of data) {
            let option = document.createElement('option');
            option.value = personality;
            option.innerText = personality;
            document.getElementById('new-bot-personality').appendChild(option);
        }
        document.getElementById('bots-creation').className = 'visible';
    }

    function refreshBots(bots) {
        console.log(`bots now: ${bots}`)
        botslist.innerHTML = ``;
        if (bots.length !== 0) {
            for (const bot of bots) {
                let box = document.createElement('div');
                box.id = bot.name;
                box.className = 'box';
                box.innerHTML = `
                    <img class="normalimage" src="/images/bot.png" alt="bot image">
                    <p>${bot.name}</p>
                    <p>${bot.personality}</p>`;
                botslist.appendChild(box);
            }
        } else
            botslist.innerHTML = `<p>You don't have any bots</p>`;

        botscontainer.className = "visible";
    }

    function enableLogOut() {
        logout.className = "visible";
    }

    function startChat(botname) {
        document.getElementById("botname-selected").value = "";
        console.log(`bot-current=${botname}`)
        document.getElementById('botname-current').innerText = botname;
        chat_history.innerHTML = '';
        chat.className = 'visible';
    }

    function showReply(response) {
        const box = document.createElement('div');
        box.innerHTML = `<p class="box"><img class="tinyimage" src="/images/bot.png" alt="bot image"><br>${response.text}</p><br>`;
        chat_history.appendChild(box);
        chat_history.scrollTop = chat_history.scrollHeight;
    }
}
