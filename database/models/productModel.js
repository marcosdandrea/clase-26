const mongoose = require('mongoose')
const { Schema } = mongoose

const ProductSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
})

const ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;
