const express = require("express")
const router = express.Router()
const { borrowed, getBorrowedBook, totalFine, alldata, borrowedUserbyBook } = require("../controllers/borrowedBook.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js")
const { perPersonFine } = require("../reports/perPersonFine.js")
const { route } = require("./most-user-book.js")

router.post("/borrowedbook", borrowed)
router.post("/borrowedbookuser",authMiddleware,borrowedUserbyBook)
router.get("/information", authMiddleware, authorizeRoles("admin"), getBorrowedBook)
router.get("/totalfine",authMiddleware, authorizeRoles("admin"), totalFine)
router.get("/allData",authMiddleware, authorizeRoles("admin"), alldata)
router.get("/perpersonfine", authMiddleware,authorizeRoles("admin"),perPersonFine)

module.exports = router

