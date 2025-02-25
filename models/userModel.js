const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
        name: {
                type: String,
                required:[true,"Add name."]
        },
        email: {
                type: String,
                required:[true,"Add email."],
                unique: true
        },
        password: {
                type: String,
                required:[true,"Add password."]
        },
        role: {
                type: String,
                required:[true,"Add role."]
        }
        
        
},{timestamps: true}
)

module.exports = mongoose.model("User", userSchema)