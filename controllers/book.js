const bookModel = require("../models/book.js");
const Counter = require("../models/counter.js");

// file upload middleware will put file info in req.file
const createBook = async (req, res) => {
    try {
        const { title, author, category, availableCopies } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "File is required" });

        const Book = await bookModel.create({
            title,
            author,
            category,
            availableCopies,
            fileUrl: req.file.path // Cloudinary URL
        });

        res.status(200).json({
            success: true,
            data: Book
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        });
    }
}

const createMultipleBooks = async (req, res) => {
  try {
    let books = req.body;

    // get current counter value
    const counter = await Counter.findOneAndUpdate(
      { id_name: 'book_id' },
      { $inc: { seq: books.length } },
      { new: true, upsert: true }
    );

    let startId = counter.seq - books.length + 1;

    // assign custom IDs manually
    books = books.map((book, index) => ({
      ...book,
      _id: startId + index
    }));

    const result = await bookModel.insertMany(books);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 5, sortBy = "createdAt", order = "desc" } = req.query;

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const books = await bookModel.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await bookModel.countDocuments();

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      books
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching books" });
  }
};


const deleteBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (book.fileUrl) {
      if (book.fileUrl.startsWith("http")) {
        const publicId = extractPublicId(book.fileUrl);
        await cloudinary.uploader.destroy(publicId);
      } else {
        fs.unlinkSync(book.fileUrl);
      }
    }

    await bookModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Book and its data deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error deleting book" });
  }
};


module.exports = {
    createMultipleBooks,
    createBook,
    getAllBooks,
    deleteBook
}
