const asyncHandler = require("express-async-handler")
const Category = require("../models/categoryModel.js")
const Ad = require("../models/adsModels.js")

// @POST
// @ROUTE /ads/:id/comment

const recordCategory = asyncHandler(async(req,res)=>{
        const {category} = req.body
        if (!category) {
                res.status(400)
                throw new Error ("please fill all fields")
        }
        const catData = await Category.create({
                category
        });
        res.status(200).json(catData)
})

// gets comments by current user
// @route GET /api/ads

const getCategory = asyncHandler(async (req, res) => {
        const category = await Category.find()
        res.status(200).json(category);
})

const categorySearch = asyncHandler(async (req, res) => {
        const adsByCat = await Ad.find({category: req.params.category})
        res.status(200).json(adsByCat);
})


module.exports = {recordCategory, getCategory, categorySearch}