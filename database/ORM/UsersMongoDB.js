require("dotenv").config()
const mongoose = require("mongoose")
const user = require("../models/userModel")


class ContenedorMongoDB {

    constructor() {
    }

    //PUBLIC METHODS

    async save(userObject) {
        await mongoose.connect(process.env.MONGO_URL)
        const username = userObject.username
        const existentUser = await user.find({username})
        if (existentUser.length!=0) {
            mongoose.disconnect();
            throw new Error ("username is in use")
        }else{            
            const newUser = new user(userObject)
            await newUser.save()
            mongoose.disconnect();
            return (newUser._id)
        }         
        
    }

    async getUsername (username){
        await mongoose.connect(process.env.MONGO_URL)
        const existentUser = await user.findOne({username})
        if (!existentUser) {
            mongoose.disconnect();
            return (null)
        }else{            
            mongoose.disconnect();
            return (existentUser)
        }
    }
}

module.exports = ContenedorMongoDB