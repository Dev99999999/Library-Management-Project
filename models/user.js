const mongoose = require("mongoose")
const Counter = require("./counter.js");

const UserScehma = mongoose.Schema({
    _id: { type: Number },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    membershipType: {
        type: String,
        enum :["premium", "basic"],
        default: "basic"
    }
},{ timestamps: true })

UserScehma.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id_name: 'user_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // create counter if it doesn't exist
        );
        this._id = counter.seq;
    }
    next();
});

module.exports = mongoose.model("user", UserScehma)