const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    alias: { type: String, required: true },
    birthday: { type: Date, required: true },
    profilePic: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, required: true }
})

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
