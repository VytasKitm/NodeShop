const express = require("express")

const router = express.Router()

const { recordCategory, getCategory, categorySearch, deleteCategory, categorySearchByName} = require("../controllers/categoryController.js")
const { protect } = require("../middleware/authMiddleware.js")
const { protectAdmin} = require("../middleware/adminAuthMiddleware.js")


router.post("/", protectAdmin, recordCategory)
router.get("/name/:category", protectAdmin, categorySearchByName)
router.get("/list", getCategory)
router.get("/search/:id", categorySearch)
router.delete("/delete/:id", protectAdmin, deleteCategory)




module.exports = router