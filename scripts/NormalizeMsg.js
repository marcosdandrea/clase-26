const util = require("util")
const normalizr = require('normalizr')
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema

const authorSchema = new schema.Entity("author")
const textSchema = new schema.Entity("text")

const msgSchema = new schema.Entity("message", {author: authorSchema})

class NormalizeMsg{
    constructor (){}

    normalize(input){
        //console.log (input)
        const normalized = normalize(input, [msgSchema])
        //this.#print (normalized)
        return normalized

    }

    denormalize(input){
        const denormalized = denormalize(input, [msgSchema])
        return denormalized
    }

    #print(msg){
        console.log (util.inspect(msg, false, 12, true))
    }

}

module.exports = NormalizeMsg