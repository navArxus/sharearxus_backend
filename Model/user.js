const mongoose = require("mongoose")
const { createHmac } = require("crypto");
const { genrateToken } = require("../services/auth");
const bcrypt = require("bcrypt")
// coNFIGURE FOR DOT ENV 
require('dotenv').config();

const userSchema = mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    temparayID: {
        required: true,
        type: String,
    },
    project: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        default: []
    }
})

userSchema.pre('save', async function () {
    const user = this;

    const hashpassword = await bcrypt.hash(user.password, 10);
    this.password = hashpassword;
})

userSchema.static("matchpassword", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        return null
    }
    // console.log(user)
    const res = await bcrypt.compare(password, user.password)
    console.log(res)
    // const genrateHashForProvided = await createHmac('sha512', salt).update(password).digest('hex')
    // console.log("user password : ",user.password)
    // console.log("hash password : ",genrateHashForProvided)
    return (res) ? genrateToken({
        email: user.email,
        temparayID: user.temparayID,
        firstName: user.firstName
    }) : null;

})

const user = mongoose.model("user", userSchema)

module.exports = user