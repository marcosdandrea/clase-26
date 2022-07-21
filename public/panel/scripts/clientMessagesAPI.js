let socket = io()
let messagesTemplates

fetch("http://localhost:8080/template/messages.hbs")
    .then(res => res.text())
    .then(baseTemplate => {
        messagesTemplates = Handlebars.compile(baseTemplate)
    })
    .catch(err => console.log(err))
    
const sendMessage = () => {
    const alias = user.alias
    const username = user.username
    const profilePic = user.profilePic
    const content = document.querySelector("#inputContent").value
    const time = new Date().toLocaleString()
    if (content == "") {
        alert("Debe ingresar un mensaje para poder enviar")
        return;
    }
    socket.emit("newMessage",
        {
            author: JSON.stringify({ id: username, alias, profilePic }),
            text: JSON.stringify({ content, time })
        }
    )
    updateSession();
    document.querySelector("#inputContent").value = "";
}

socket.on("newMessages", messages => {
    const context = JSON.parse(messages);
    //console.log (context)
    const denormalizedMsg = denormalizeMsg(context);
    //console.log (denormalizedMsg)
    if (!messagesTemplates) return
    const html = messagesTemplates({ messages: denormalizedMsg });
    const hbsMessages = document.getElementById("hbsMessages")
    hbsMessages.innerHTML = html
    hbsMessages.scroll(0, hbsMessages.childElementCount * 20);
})

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function denormalizeMsg(input) {
    const normalize = normalizr.normalize;
    const denormalize = normalizr.denormalize;
    const schema = normalizr.schema

    const authorSchema = new schema.Entity("author")
    const msgSchema = new schema.Entity("message", { author: authorSchema })
    const denormalized = denormalize(input.result, [msgSchema], input.entities)
    const inputLength = JSON.stringify(input).length
    const denormalizedLength = JSON.stringify(denormalized).length
    const compressRatio = ((denormalizedLength * 100) / inputLength)-100
    document.querySelector("#compressionRatio").innerText = "Compression Ratio: " + compressRatio.toFixed(2) + "%"
    return (denormalized)

}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnSendMessage").addEventListener("click", sendMessage)
})

function updateSession(){
    const URL = "/auth/update"
    fetch(URL)
    .catch(error => console.log(error));
}