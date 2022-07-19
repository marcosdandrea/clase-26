
module.exports = class ProductsAPI {

    constructor(app) {
        this.app = app;        
        
        this.app.get('/productos', checkAuthorized, (req, res, next)=>{
            console.log ("enviando productos")
            const products = [{
                productName: "Marcos",
                productPrice: "123",
                productImage: "bla bla"
            }]
            res.send(products)
        })

        function checkAuthorized(req, res, next){
            if (req.user?.level == "admin") {
                console.log (">> usuario autorizado")
                return next()
            }
            console.log (">> usuario no autorizado")
            res.status(401)
            res.send("Acceso denegado")
        }

    }
}