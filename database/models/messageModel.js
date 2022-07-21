const mongoose = require('mongoose')
const { Schema } = mongoose

const MessageSchema = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true }
})

const MessageModel = mongoose.model('message', MessageSchema);
module.exports = MessageModel;
