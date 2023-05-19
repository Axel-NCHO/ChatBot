window.onload = function () {

    const chat_history = document.getElementById("chat-history");
    const BOT_URL = "/chat/response";
    const USER_ID = document.getElementById("userid").innerText;
    alert(USER_ID);
    const BOT_NAME = document.getElementById("botname");

    const user_input = document.getElementById("chat-user-input");
    user_input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            let input_text = user_input.value;
            alert(input_text);
            user_input.value = "";

            const input = document.createElement('div');
            input.innerHTML = `<p>${input_text}</p>`;
            chat_history.appendChild(input);

            const rawResponse = await fetch(BOT_URL,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: USER_ID,
                        botname: BOT_NAME,
                        input: input_text})
                });
            const response = await rawResponse.json();

            const box = document.createElement('div');
            box.innerHTML = `<p>${response.text}</p><br>`;
            chat_history.appendChild(box);
        }
    })
}