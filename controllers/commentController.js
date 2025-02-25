const asyncHandler = require("express-async-handler")
const Comments = require("../models/commentsModel")

// @POST
// @ROUTE /ads/:id/comment

const recordComment = asyncHandler(async(req,res)=>{
        const {comment} = req.body
        const adId = req.params.id
        if (!comment) {
                res.status(400)
                throw new Error ("please fill all fields")
        }
        const comData = await Comments.create({
                comment,
                user: req.user.id,
                ad: req.params.id
        });
        res.status(200).json(comData)
})

// gets comments by current user
// @route GET /api/ads

const getComment = asyncHandler(async (req, res) => {
        const comment = await Comments.find({user: req.user.id})
        res.status(200).json(comment);
})

const getCommentAd = asyncHandler(async (req, res) => {
      const comment = await Comments.find({ad: req.params.id})
      res.status(200).json(comment)
})


module.exports = {recordComment, getComment, getCommentAd}