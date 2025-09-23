const mongoose = require("mongoose")

const activityTracker = mongoose.Schema({
    user_id: {
        type: Number,
        ref: 'user',
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

module.exports = mongoose.model('activityTracker', activityTracker)