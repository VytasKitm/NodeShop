const express = require("express")

const router = express.Router()

const { registerUser, loginUser, getUsers, getUserF, getUserById, deleteUser} = require("../controllers/userController.js")
const { protect } = require("../middleware/authMiddleware.js")
const { protectAdmin} = require("../middleware/adminAuthMiddleware.js")

router.route("/user").get(protect, getUserF)
router.post("/",registerUser)
router.post("/login",loginUser)
router.get("/list", protectAdmin, getUsers)
router.get("/:id", getUserById)
router.delete("/delete/:id", protectAdmin, deleteUser)
// router.get("/user", protect, getUser)




module.exports = router