const mongoose = require("mongoose")
const Counter = require("./counter.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
        enum: ['user', 'admin'],
        default: 'user'
    },
    membershipType: {
        type: String,
        enum: ["premium", "basic"],
        default: "basic"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true })

// UserScehma.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Generate password reset token
UserScehma.methods.getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 min
  return resetToken;
};

UserScehma.pre('save', async function (next) {
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