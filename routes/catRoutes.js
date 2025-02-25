const express = require("express")

const router = express.Router()

const { recordCategory, getCategory, categorySearch} = require("../controllers/categoryController.js")
const { protect } = require("../middleware/authMiddleware.js")
const { protectAdmin} = require("../middleware/adminAuthMiddleware.js")


router.post("/", protectAdmin, recordCategory)
router.get("/list", getCategory)
router.get("/search/:id", categorySearch)




module.exports = router