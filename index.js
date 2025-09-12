require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.PORT
const connectDatabase = require("./db.js")
const User = require("./routes/user.js")
const Book = require("./routes/book.js")
const borrowedBook = require("./routes/borrowedBook.js")
// const path = require("path")
// const expressLayouts = require("express-ejs-layouts");

connectDatabase()

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(expressLayouts);
// app.set("layout", "layouts/layout");


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api",User)
app.use("/api",Book)
app.use("/api",borrowedBook)

app.get("/", (req, res) => {
  res.render("index", { title: "Library Management" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
