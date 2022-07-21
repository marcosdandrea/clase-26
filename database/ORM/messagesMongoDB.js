require("dotenv").config()
const mongoose = require("mongoose")
const message = require("../models/messageModel")

class ContenedorMongoDB {

    constructor() {
    }

    //PUBLIC METHODS

    async save(messageObject) {
        await mongoose.connect(process.env.MONGO_URL)  
            const newMesssage = new message(messageObject)
            await newMesssage.save()
            mongoose.disconnect();
            return (newMesssage._id)                 
    }

    async getAllMessages (){
        await mongoose.connect(process.env.MONGO_URL)
        const allMessage = await message.find({}, { '__v': 0} )
        const allMessageMapped = allMessage.map(msg => 
            ({
            id: msg._id,
            author: JSON.parse(msg.author),
            text: JSON.parse(msg.text)
            })
        )
        return (allMessageMapped)
        
    }
}

module.exports = ContenedorMongoDB