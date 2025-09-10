require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.PORT
const connectDatabase = require("./db.js")
const User = require("./routes/user.js")
const Book = require("./routes/book.js")
const borrowedBook = require("./routes/borrowedBook.js")

connectDatabase()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api",User)
app.use("/api",Book)
app.use("/api",borrowedBook)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
