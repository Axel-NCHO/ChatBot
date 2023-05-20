window.onload = function () {

    const chat_history = document.getElementById("chat-history");
    const userid = document.getElementById("user-id-value");
    const userpwd = document.getElementById("user-pwd-value");
    const botname = document.getElementById("botname-current");
    const user_input = document.getElementById("user-input-chat");

    user_input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            let id = userid.innerText;
            let pwd = userpwd.innerText;
            let name = botname.innerText;
            let input_text = user_input.value;
            user_input.value = "";

            if (input_text !== "") {
                const input = document.createElement('div');
                input.innerHTML = `<p>${input_text}</p>`;
                chat_history.appendChild(input);

                const rawResponse = await fetchData(`/chatbot/api/v1/chat/response}`, 'POST', {
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
    });

    function showReply(response) {
        const box = document.createElement('div');
        box.innerHTML = `<p>${response.text}</p><br>`;
        chat_history.appendChild(box);
    }
}