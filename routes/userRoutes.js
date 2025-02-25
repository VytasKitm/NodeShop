const express = require("express")

const router = express.Router()

const { registerUser, loginUser, getUsers, getUser, getUserById} = require("../controllers/userController.js")
const { protect } = require("../middleware/authMiddleware.js")
const { protectAdmin} = require("../middleware/adminAuthMiddleware.js")


router.post("/",registerUser)
router.post("/login",loginUser)
router.get("/list", protectAdmin, getUsers)
router.get("/:id", getUserById)
// router.get("/user", protect, getUser)
router.route("/user").get(protect, getUser)



module.exports = router