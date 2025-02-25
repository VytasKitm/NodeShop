const mongoose = require("mongoose")

const adSchema = new mongoose.Schema({
        user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
        },
        title: {
                type: String,
                required:[true,"Add title."]
        },
        category: {
                type: String
        },
        description: {
                type: String,
                required:[true,"Add description."]
        },
        price: {
                type: String,
                required:[true,"Add price."]
        },
        photo: {
                type: String,
                required: true
        }
        
        
},{timestamps: true}
)

module.exports = mongoose.model("Ads",adSchema)