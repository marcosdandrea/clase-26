const passport = require("../security/passport")
const multer = require("multer");

const cookieParser = require("cookie-parser")
require("dotenv").config()

const storage = multer.diskStorage({
    destination: "public/images/profiles",
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })

module.exports = class UsersAPI {

    constructor(app) {
        this.app = app;
        this.app.use(cookieParser())

        this.app.post("/auth/register",
            uploader.single("profilePic"),
            passport.authenticate("registration", { session: true }), (req, res, next) => {
                // sign up
                res.send({ msg: "Usuario registrado con éxito", redirect: "/panel" })

            })

        this.app.post("/auth/login",
            passport.authenticate("login", { session: true }), (req, res, next) => {
                console.log(req.user.username)
                const cookieContent = {
                    alias: req.user.alias,
                    username: req.user.username,
                    profilePic: req.user.profilePic
                }
                res.cookie("user", JSON.stringify(cookieContent))
                res.status(200).redirect("/panel")
                console.log("> Usuario logueado:", req.user.username)
            });

        this.app.post('/auth/logout',
            (req, res, next) => {
                if (req.user) {
                    console.log("Cerrando sesion")
                    req.logout(function (err) {
                        if (err) return next(err);
                        res.redirect("/")
                    });
                } else {
                    res.redirect("/")
                }
            });
        
        this.app.get('/auth/update',  
            (req, res, next) => { 
                console.log ("> updating session")
                res.status(200).send({session: "updated"}) 
            })

    }
}