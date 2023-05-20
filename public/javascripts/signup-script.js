window.onload = function () {

    let userid = document.getElementById("id-signup");
    let userpwd = document.getElementById("pwd-signup");
    let submit = document.getElementById("submit-signup");


    submit.addEventListener('click', async (e) => {
        if (e.button === 0) {   // left click
            let id = userid.value;
            let pwd = userpwd.value;
            if (id !== "") {
                if (pwd !== "") {
                    const rawResponse = await fetchData('/chatbot/api/v1/users/registration', 'POST', {
                        id: id,
                        pwd: pwd
                    });
                    switch (rawResponse.status) {
                        case 404:
                            alert("RESOURCE NOT FOUND");
                            break;
                        case 500:
                            alert("SERVER ERROR");
                            break;
                        default:
                            alert(`REGISTRATION COMPLETED. ID: ${id}`);
                            clearSignup();
                    }
                } else
                    alert("Missing password")
            } else
                alert("Missing ID");
        }
    });

    function clearSignup() {
        userid.value = "";
        userpwd.value = "";
    }
}