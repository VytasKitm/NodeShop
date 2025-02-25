const asyncHandler = require("express-async-handler")
const Ad = require("../models/adsModels.js")

// @POST
// @ROUTE /ads

const recordAd = asyncHandler(async(req,res)=>{
        const {title,description,category,price,photo} = req.body
        if (!title || !description || !price || !photo) {
                res.status(400)
                throw new Error ("please fill all fields")
        }
        const ad = await Ad.create({
                title,
                description,
                category,
                price,
                photo,
                user: req.user.id
        });
        res.status(200).json(ad)
})

// @route GET /api/ads

const getUserAds = asyncHandler(async (req, res) => {
        const ads = await Ad.find({user: req.user.id})
        res.status(200).json(ads);
})


// @route GET /api/all
const getAllAds = asyncHandler(async (req, res) => {
        const ads = await Ad.find()
        res.status(200).json(ads)
})
// @route PUT /api/ads/:id

const updateAd = asyncHandler(async (req, res) => {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
                res.status(400);
                throw new Error("Ad not found");
        }

        if (!req.user) {
                res.status(401);
                throw new Error("User not found")
        }

        if (ad.user.toString() !== req.user.id && req.user.role !== "admin") {
                res.status(401);
                throw new Error("User not authorized");
        }

        if (req.user.role === "admin" || ad.user.toString() === req.user.id) {
                const updateAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {});
                res.status(200).json(updateAd)
        }
})

// @route DELETE /api/ads/:id

const deleteAd = asyncHandler(async (req, res) => {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
                res.status(400)
                throw new Error("Ad not found")
        }

        if (!req.user) {
                res.status(401)
                throw new Error("User not found")
        }

        if (ad.user.toString() !== req.user.id) {
                res.status(401)
                throw new Error("User not authorized")
        }

        await Ad.findByIdAndDelete(req.params.id);
        res.status(200).json({id: req.params.id})
})

module.exports = {recordAd, updateAd, getUserAds, deleteAd, getAllAds}