const mongoose = require("mongoose")
const Counter = require("./counter.js");

const BookSchema = mongoose.Schema({
    _id: { type: Number },
    title: String, 
    author: String, 
    category: String, 
    availableCopies: {
        type: Number,
        default: 1
    },
    fileUrl: String,
});

BookSchema.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id_name: 'book_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
    next();
});

module.exports = mongoose.model("book", BookSchema)