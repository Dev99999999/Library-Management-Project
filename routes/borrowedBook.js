const express = require("express")
const router = express.Router()
const { borrowed, getBorrowedBook, totalFine, alldata } = require("../controllers/borrowedBook.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js")

router.post("/borrowedbook", borrowed)
router.get("/information", authMiddleware, authorizeRoles("admin"), getBorrowedBook)
router.get("/totalfine",authMiddleware, authorizeRoles("admin"), totalFine)
router.get("/allData",authMiddleware, authorizeRoles("admin"), alldata)

module.exports = router

