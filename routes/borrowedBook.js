const express = require("express")
const router = express.Router()
const { borrowed, getBorrowedBook, totalFine, alldata } = require("../controllers/borrowedBook.js")

router.post("/borrowedbook", borrowed)
router.get("/information", getBorrowedBook)
router.get("/totalfine",totalFine)
router.get("/allData", alldata)

module.exports = router

