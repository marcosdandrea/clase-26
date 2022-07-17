const passport = require("../security/passport")

module.exports = class UsersAPI {

    constructor(app) {
        this.app = app;

        this.app.post("/auth/register",
            passport.authenticate("registration", { session: true }), (req, res, next) => {
                // sign up
                res.send({msg: "Usuario registrado con éxito", redirect: "/panel"})

        })

        this.app.post("/auth/login",
            passport.authenticate("login", { session: true }), (req, res, next) => {
                // login
                console.log ("usuario logueado:", req.user.username)
                res.cookie("username", req.user.username)
                res.send({redirect: "/panel"})
            });

        this.app.post('/auth/logout', 
        (req, res) => {
            console.log ("Cerrando sesion")
            if (req.user) {
                req.logout(function (err) {
                    if (err) return next(err);
                    res.redirect("/panel")
                });
            } else {
                console.log("No hay ninguna sesión iniciada")
            }
            });

        this.app.use((error, req, res, next) => {
            res.status(500).send(error.message)
            })

        this.app.use(passport.session());
        
        this.app.get('/main', checkAuthorized, (req, res)=>{
            res.send("Usted está autorizado a ver este sitio")
        })

        function checkAuthorized(req, res, next){
            if (req.user?.level == "admin") 
                return next()
            res.send ("No está autorizado a ver este sitio")
        }
    }
}