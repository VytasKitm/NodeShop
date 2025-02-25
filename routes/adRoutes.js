const express = require("express")

const router = express.Router()

const { recordAd, updateAd, getUserAds, deleteAd, getAllAds } = require("../controllers/adController")
const { protect } = require("../middleware/authMiddleware.js")
const { recordComment, getComment, getCommentAd } = require("../controllers/commentController.js")

router.route("/").post(protect, recordAd).get(protect, getUserAds)
router.route("/:id").put(protect, updateAd).delete(protect, deleteAd)
router.route("/:id/comment").post(protect, recordComment)
router.route("/comment/list").get(protect, getComment)
router.route("/:id/comment/list").get(protect, getCommentAd)
router.route("/all").get(protect, getAllAds)

module.exports = router