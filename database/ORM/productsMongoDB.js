require("dotenv").config()
const mongoose = require("mongoose")
const product = require("../models/productModel")


class ContenedorMongoDB {

    constructor() {
    }

    //PUBLIC METHODS

    async save(productObject) {
        await mongoose.connect(process.env.MONGO_URL)  
            const newProduct = new product(productObject)
            await newProduct.save()
            mongoose.disconnect();
            return (newProduct._id)                 
    }

    async getAllProducts (){
        await mongoose.connect(process.env.MONGO_URL)
        const allProducts = await product.find({})
        return (allProducts)
        
    }
}

module.exports = ContenedorMongoDB