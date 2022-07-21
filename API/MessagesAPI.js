const { Server } = require("socket.io");
const MessageDB = require("../database/ORM/messagesMongoDB")
const NormalizeMsg = require("../scripts/NormalizeMsg")

const messageDB = new MessageDB()
const normalize = new NormalizeMsg()

module.exports = class MessagesAPI{
    constructor(server){
        const io = new Server(server);

        io.on('connection', (socket) => {
            console.log('> cliente de chat conectado: ' + socket.id);
            sendAllMessages();

            socket.on("newMessage", async (message)=>{
                try{
                    await messageDB.save(message)
                    sendAllMessages()                
                }catch(err){console.log (err)}
            })

            async function sendAllMessages(){
                try{
                    const message = await messageDB.getAllMessages()
                    const normalizedMsgs = normalize.normalize(message)
                    socket.emit("newMessages", JSON.stringify(normalizedMsgs))   
                }catch(err) {console.log (err)}  
            }

        });

        
    }

}