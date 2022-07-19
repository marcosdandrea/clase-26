const passport = require("../security/passport")
const cookieParser = require("cookie-parser")
require("dotenv").config()

module.exports = class UsersAPI {

    constructor(app) {
        this.app = app;
        this.app.use (cookieParser())

        this.app.post("/auth/register",
            passport.authenticate("registration", { session: true }), (req, res, next) => {
                // sign up
                res.send({msg: "Usuario registrado con éxito", redirect: "/panel"})

        })

        this.app.post("/auth/login",
            passport.authenticate("login", { session: true }), (req, res, next) => {
                const maxAge = parseInt(process.env.SESION_DURATION)
                const cookieProperties = {maxAge}
                res.cookie("username", req.user.username, cookieProperties )
                res.status(200).redirect("/panel")
                console.log ("> Usuario logueado:", req.user.username)
            });

        this.app.post('/auth/logout', 
        (req, res, next) => {
            if (req.user) {
                console.log ("Cerrando sesion")
                req.logout(function (err) {
                    if (err) return next(err);
                    res.redirect("/")
                });
            } else {
                console.log("No hay ninguna sesión iniciada")
            }
            });

    }
}