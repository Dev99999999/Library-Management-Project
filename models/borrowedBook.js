const mongoose = require("mongoose")

const BorrowBookSchema = mongoose.Schema({
    userId: { 
        type: Number, 
        ref: "user" 
    },
    bookId: { 
        type: Number, 
        ref: "book",
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000
    },
    returnDate: Date,
    fine: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("borrowedBook", BorrowBookSchema)