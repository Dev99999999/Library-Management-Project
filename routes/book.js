const express = require("express")
const router = express.Router()
const { createBook, getAllBooks, createMultipleBooks, deleteBook, searchBook, updateBook } = require("../controllers/book.js")
const upload = require("../middleware/upload.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js")


router.post("/book", authMiddleware, authorizeRoles("admin"), upload.single('bookFile'), async (req, res, next) => {
    try {
      if (req.file) {
        await createBook(req, res);
      } else {
        let books = req.body;

        if (typeof books === "string") {
          books = JSON.parse(books);
        }

        if (Array.isArray(books)) {
          await createMultipleBooks({ body: books }, res);
        } else {
          res.status(400).json({ success: false, message: "No file or book data provided" });
        }
      }
    } catch (err) {
      next(err);
    }
  }
);


router.get("/allbook", getAllBooks)
router.get("/book/search",searchBook)
router.delete("/book/:id", authMiddleware, authorizeRoles("admin"), deleteBook);
router.put("/book/:id", authMiddleware, authorizeRoles("admin"),updateBook)

module.exports = router

