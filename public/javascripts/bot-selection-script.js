window.onload = function () {

    let chat = document.getElementById('chat');
    let userid = document.getElementById("user-id-value");
    let userpwd = document.getElementById("user-pwd-value");
    let botname = document.getElementById("botname-selected");
    let submit = document.getElementById("submit-bot-selection");


    submit.addEventListener('click', async (e) => {
        if (e.button === 0) {   // left click
            let id = userid.innerText;
            let pwd = userpwd.innerText;
            let name = botname.value;
            if (name !== "") {
                const rawResponse = await fetchData(`/chatbot/api/v1/chat?id=${id}&pwd=${pwd}&name=${name}`, 'GET', {});
                switch (rawResponse.status) {
                    case 404:
                        alert(`YOU DO NOT HAVE A BOT NAMED ${name}`);
                        break;
                    case 500:
                        alert("SERVER ERROR");
                        break;
                    default:
                        startChat();
                }
            } else
                alert("Missing bot name")
        }
    });

    function startChat() {
        document.getElementById('botname-current').innerText = botname.value;
        chat.className = 'visible';
    }
}