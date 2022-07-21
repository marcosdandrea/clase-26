const multer = require("multer");
const ProductsDB = require("../database/ORM/productsMongoDB")

const storage = multer.diskStorage({
    destination: "public/images/products",
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })
const productsDB = new ProductsDB()

module.exports = class ProductsAPI {

    constructor(app) {
        this.app = app;

        this.app.get('/products', checkAuthorized, async (req, res, next) => {
            const allProducts = await productsDB.getAllProducts()
            res.send(allProducts)
        })

        this.app.post("/products", checkAuthorized, uploader.single("image"), (req, res) => {
            const { file } = req;

            const title = req.query.title || req.body.title
            const price = parseFloat(req.query.price) || parseFloat(req.body.price)
            const imgDir = "../images/products/"
            const image = imgDir + file.filename
            const newProduct = { title, price, image }

            if ((title == undefined) || (price == undefined) || (image == undefined) || (isNaN(price))) {
                console.log(newProduct)
                res.status(404).send(JSON.stringify({ error: "datos incorrectos" }))
                return
            }
            productsDB.save(newProduct)
                .then(id => {
                    res.status(200).send(JSON.stringify(id))
                })
                .catch((err) => {
                    console.log(err)
                    res.status(501).send(JSON.stringify({ error: 'producto no agregado' }))
                })
        })

        function checkAuthorized(req, res, next) {
            if (req.user?.level == "admin") {
                console.log(">> usuario autorizado")
                next()
            } else {
                console.log(">> usuario no autorizado")
                res.status(401)
                res.send("Acceso denegado")
            }
        }

    }
}