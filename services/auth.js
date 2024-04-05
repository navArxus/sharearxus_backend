const JWT = require('jsonwebtoken')
require('dotenv').config();
const genrateToken = user => {
    const token = JWT.sign(user,process.env.JWT_SECRET)
    return token;
}

const validateToken = token => {
    const res = JWT.verify(token,process.env.JWT_SECRET)
    if (res){
        return res
    }else{
        return null
    }
}
module.exports = {
    genrateToken,
    validateToken
}