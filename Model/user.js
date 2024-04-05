const mongoose = require("mongoose")
const { createHmac } = require("crypto");
const { genrateToken } = require("../services/auth");
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

    const salt = process.env.salt;
    const hashpassword = await createHmac('sha512', salt).update(user.password).digest('hex');
    this.password = hashpassword;
})

userSchema.static("matchpassword", async function (email, password) {
    const salt = process.env.salt;
    const user = await this.findOne({ email });
    if (!user) {
        return "No such user"
    }
    // console.log(user)
    const genrateHashForProvided = await createHmac('sha512', salt).update(password).digest('hex')
    // console.log("user password : ",user.password)
    // console.log("hash password : ",genrateHashForProvided)
    return (user.password === genrateHashForProvided) ? genrateToken({
        email : user.email,
        temparayID : user.temparayID,
        firstName : user.firstName
    }) : null;

})

const user = mongoose.model("user", userSchema)

module.exports = user