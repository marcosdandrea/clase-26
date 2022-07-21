
let user

document.addEventListener("DOMContentLoaded", () => {

    checkSession()

    document.querySelector("#btnLogout").addEventListener("click", () => {
        const URL = "/auth/logout"
        fetch(URL, {
            method: 'POST'
        })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(function (err) {
                console.info(err + " url: " + url);
            });
    })


})


function getCookie(cname, raw) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    if (!raw)
        return "";
    return decodedCookie
}


function checkSession() {
    user = JSON.parse(getCookie("user", false))
    user.profilePic = "http://localhost:8080/images/profiles/" + user.profilePic
    const welcomeMsg = "Bienvenido " + user.alias
    document.querySelector("#welcome").textContent = welcomeMsg.toUpperCase()

    const check = setInterval(() => {
        const thisSession = getCookie("connect.sids", true)
        if (!thisSession) {
            clearInterval(check)
            alert("Su sesión se ha cerrado por inactividad")
            location.replace("/")
        }
    }, 5000)
}






