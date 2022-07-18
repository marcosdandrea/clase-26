const express = require("express");
const session = require("express-session")
const MongoStore = require('connect-mongo')
const path = require('path');
const app = express();
const PORT = 8080;
const db = require('./database/database');
const UsersAPI = require("./API/usersAPI");
const PanelAPI = require("./API/panelAPI")
const passport = require("passport");

const mongoUrl = process.env.MONGO_URL;
const advancedOptions = { useNewUrlParse: true, useUnifiedTopology: true }
app.use(session(    {
    store: MongoStore.create({ mongoUrl, advancedOptions }),
    secret: "marcos123",
    resave: true,
    cookie: { maxAge: parseInt(process.env.SESION_DURATION) },
    saveUninitialized: true,
}))

app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

new UsersAPI(app)
new PanelAPI(app)

app.use("/", express.static(path.join(__dirname, '/public')))

app.use((error, req, res, next) => {
    res.status(500).send(error.message)
    })

app.use(passport.session());

db.connect()
    .then(()=>{
        app.listen(PORT, () => {
            console.log(`> Servidor escuchando en puerto ${PORT}`);
        });
    })
