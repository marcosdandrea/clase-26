const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config()

const dbUrl = process.env.MONGO_URL;

const connect = () => {
    return new Promise(async (resolve, reject) => {
        mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = mongoose.connection;
        db.on("error", () => {
            console.log("no se pudo conectar a mongodb");
            reject()
        });
        db.once("open", () => {
            console.log("> Conectado a la base de datos");
            resolve()
        });
    })
};
module.exports = { connect };