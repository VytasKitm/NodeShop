const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js")

const NOT_AUTHORIZED = "not authorized"
const NOT_AUTHORIZED_NO_TOKEN = "not authorized no token"

async function getUser(req) {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                const token = req.headers.authorization.split(" ")[1]
                if(!token) {
                        return{status:401,response: NOT_AUTHORIZED_NO_TOKEN}
                }
                const decoded = jwt.verify(token, process.env.JWT_SALT)
                const user = await User.findById(decoded.id).select("-password")
                return {status: 200, response: user}
        }
        return {status: 401, response: NOT_AUTHORIZED}
}

module.exports = { getUser, notAuthorizedMessage: NOT_AUTHORIZED}