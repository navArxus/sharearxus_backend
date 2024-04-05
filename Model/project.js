const mongoose = require("mongoose")
// coNFIGURE FOR DOT ENV 
require('dotenv').config();

const projectSchema = mongoose.Schema({
    roomID: {
        required:true,
        type: String,
        unique:true
    },
    ownerID: {
        required: true,
        type: String,
    },
    codeSnippet:[{
        name:String,
        language: String,
        code:String
    }],
    document:[String],
    activity:[String]
})


const projectmodel = mongoose.model("project", projectSchema)

module.exports = projectmodel