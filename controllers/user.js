const UserModel = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const Blacklist = require("../models/blackList.js")
const activityTracker = require("../models/activityTracker.js")
// const UAParser = require("ua-parser-js");
const DeviceDetector = require("device-detector-js")


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

        // const salt = await bcrypt.genSalt(10);
        // const hashPass = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password,
            role: role || "user",
            membershipType: membershipType || "basic"
        });

        await newUser.save();

        activityTracker.create({
            user_id: newUser._id,
            actionType: `user register Successfully`,
            details: { userName: newUser.name, email: newUser.email }
        })

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

        // exports.activityTracker.create({
        //     // user_id,
        //     actionType: `Admin see all users..`,
        //     // details: { userName: req.user.name }
        // })


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

        // Parse device info:
        // const parser = new UAParser(req.headers["user-agent"]);
        // const deviceInfo = parser.getDevice() ;

        // console.log(deviceInfo)

        // let deviceName = "Unknown Device";

        // if (deviceInfo.vendor && deviceInfo.model) {
        //     deviceName = `${deviceInfo.vendor} ${deviceInfo.model}`;
        // } else {
        //     // Fallback: Directly parse from user-agent
        //     const ua = req.headers["user-agent"];

        //     // Example: "Mozilla/5.0 (Linux; Android 11; Redmi 9)"
        //     const match = ua.match(/\((.*?)\)/); // andar wali () content nikal lo
        //     if (match && match[1]) {
        //         const parts = match[1].split(";");
        //         if (parts.length > 2) {
        //             deviceName = parts[2].trim(); // mostly yaha model hota hai
        //         }
        //     }
        // }

        const deviceDetector = new DeviceDetector()
        const device = deviceDetector.parse(req.headers["user-agent"])

        console.log(device)

        let deviceName = "Unknow device"

        if(device.device && device.device.brand && device.device.model){
            deviceName = `${device.device.brand} ${device.device.model}`
        }
        else if(device.device && device.device.model){
            deviceName = `${device.device.model}`
        }
        else if(device.device && device.device.brand){
            deviceName = `${device.device.brand}`
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "180d" });


        if (!user.tokens) user.tokens = [];

        user.tokens.push({ token, device: deviceName });

        activityTracker.create({
            user_id: user._id,
            actionType: `user login Successfully`,
            details: { userName: user.name, email: user.email, device: deviceName }
        })

        await user.save()
        res.status(200).json({ success: true, token, deviceName });

        // activityTracker.create({
        //     user_id:req.body._id,
        //     actionType: `user  Successfully`,
        //     details: { userName: req.body.name }
        // })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:3000/api/reset-password/${resetToken}`;

        console.log(`Reset Password Link: ${resetUrl}`);

        activityTracker.create({
            user_id: user._id,
            actionType: `user  Successfully`,
            details: { email: user.email, userName: user.name }
        })

        res.json({
            success: true,
            message: "Reset link generated. Check console for URL"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        activityTracker.create({
            user_id: user._id,
            actionType: `user reset their password successFully`,
            details: { email: user.email, userName: user.name }
        })

        res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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

        activityTracker.create({
            user_id: user._id,
            actionType: `user updated thier password  Successfully`,
            details: { email: user.email, userName: user.name }
        })

        res.json({
            message: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const user = await UserModel.findOne({ "tokens.token": token})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not exits here.."
            })
        }

        const decoded = jwt.decode(token);

        const expireTime = new Date(decoded.exp * 1000);
        await Blacklist.create({ token, expiredAt: expireTime });

        res.json({ success: true, message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


module.exports = {
    registerUser,
    getUSer,
    loginUser,
    forgotPassword,
    resetPassword,
    updatePass,
    logout
}