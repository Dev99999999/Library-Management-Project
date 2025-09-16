require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.PORT
const connectDatabase = require("./db.js")
const User = require("./routes/user.js")
const Book = require("./routes/book.js")
const borrowedBook = require("./routes/borrowedBook.js")
const path = require("path")
const expressLayouts = require("express-ejs-layouts");

connectDatabase()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// // Set EJS as view engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Use layouts
// app.use(expressLayouts);
// app.set("layout", "layouts/layout");

app.use("/api",User)
app.use("/api",Book)
app.use("/api",borrowedBook)

// app.get("/", (req, res) => {
//   res.render("index", { title: "Library Management" });
// });

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`)
})
