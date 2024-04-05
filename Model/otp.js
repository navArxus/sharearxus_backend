
const mongoose = require("mongoose")
// coNFIGURE FOR DOT ENV 
require('dotenv').config();

const otpSchema = mongoose.Schema({
    email: {
        required:true,
        type: String
    },
    otp: {
        required: true,
        type: String,
    },
})


const otpmodel = mongoose.model("otp", otpSchema)

module.exports = otpmodel