const passport = require("passport")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy;
const UserDatabase = require("../database/ORM/UsersMongoDB")
const userDatabase = new UserDatabase()

passport.use("registration", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        if (existentUser)
            return callback(new Error("Ya existe el usuario"))     
        const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = {fullname: req.body.fullname, username, password: hashedPass, level: "admin" }
        await userDatabase.save(newUser)
        callback(null, newUser)
    } catch (err) {
        callback(new Error(err))
    }
}));

passport.use("login", new LocalStrategy(
    {passReqToCallback : true},
    async (req, username, password, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        if (!existentUser ||!bcrypt.compareSync(password, existentUser.password))
            return callback(new Error ("Usuario o contraseña incorrectos"))       
        callback(null, existentUser)
    } catch (err) {
        callback(new Error(err))
    }
}));

passport.serializeUser((user, callback) => {
    callback(null, user.username)
})

passport.deserializeUser(async (username, callback) => {
    try {
        const existentUser = await userDatabase.getUsername(username)
        callback(null, existentUser)
    } catch (err) {
        callback(new Error(err))
    }
})

module.exports = passport;