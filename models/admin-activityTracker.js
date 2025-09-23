const mongoose = require("mongoose")

const adminActivityTracker = mongoose.Schema({
    book_id: {
        type: Number,
        ref: 'book',
        // required: true
    },
    actionType: {
        type: String,
        required: true
    },
    details: {
        type: Object
    },
    timestamp: {
        type: Date,
        default: Date.now
    } 
})

module.exports = mongoose.model("adminActivityTracker", adminActivityTracker)