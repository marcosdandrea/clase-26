const socketIO = require("socket.io")
const { Server } = require("socket.io");

module.exports = class MessagesAPI{
    constructor(server){
        const io = new Server(server);

        io.on('connection', (socket) => {
            const address = socket.handshake.address;
            console.log('> cliente de chat conectado: ' + socket.id);
          });
    }

}