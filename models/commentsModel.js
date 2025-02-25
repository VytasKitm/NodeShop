const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
        user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
        },
        ad: {
                type: String,
                required: true,
        },
        comment: {
                type: String,
                required:true
        }
        
},{timestamps: true}
)

module.exports = mongoose.model("Comments",CommentSchema)