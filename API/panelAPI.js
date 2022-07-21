const passport = require("../security/passport")

module.exports = class PanelAPI {

    constructor(app) {
        this.app = app;        
        
        this.app.get('/panel', checkAuthorized, (req, res, next)=>{
            next()
        })

        function checkAuthorized(req, res, next){
            if (req.user?.level == "admin") 
                return next()
            res.redirect("/notAllowed.html")
        }

    }
}