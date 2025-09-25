const express = require("express")
const router = express.Router()
const { getMostBookReader, mostfamousBook } = require("../reports/report.js")

router.get("/most-active-users", getMostBookReader)
router.get("/most-famous-books", mostfamousBook)


module.exports = router
