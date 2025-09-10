const UserModel = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, membershipType } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        const checkExistingUser = await UserModel.findOne({ email });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashPass,
            role: role || "user",
            membershipType: membershipType || "basic"
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            data: newUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the user"
        });
    }
};

const getUSer = async (req, res) => {
    try {
        const { page = 1, limit = 5, sortBy = "createdAt", order = "desc" } = req.query;

        const sortOrder = order === "asc" ? 1 : -1;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const allUser = await UserModel.find()
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNumber);

        const total = await UserModel.countDocuments();

        res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            allUser
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: 0,
            message: "Some Error Issue here.."
        })
    }
}


//Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) return res.status(400).json({ success: false, message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });

        res.status(200).json({ success: true, token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

//update password
const updatePass = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    registerUser,
    getUSer,
    loginUser,
    updatePass
}