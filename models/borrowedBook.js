const mongoose = require("mongoose")

const BorrowBookSchema = mongoose.Schema({
    userId: { 
        type: Number, 
        ref: "user" 
    },
    bookId: { 
        type: Number, 
        ref: "book" 
    },
    borrowDate: {
        type: Date,
        default: Date.now()
    },
    returnDate: Date,
    fine: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("borrowedBook", BorrowBookSchema)