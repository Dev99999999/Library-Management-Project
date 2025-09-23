const express = require("express")
const router = express.Router()
const { registerUser, getUSer, updatePass, loginUser, forgotPassword, resetPassword, logout } = require("../controllers/user.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js");
const activityTracker = require("../models/activityTracker.js")
const adminActivityTracker = require("../models/admin-activityTracker.js")


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/alluser", authMiddleware, authorizeRoles("admin") ,getUSer)

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.put("/change-password", authMiddleware, updatePass);

router.delete("/user/logout",authMiddleware,logout)

router.get("/user-activities", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    const activities = await activityTracker.find()
    // console.log(activities)
    // console.log(activities)
    res.json(activities)
})

router.get("/community", async(req, res) => {
    const activities = await adminActivityTracker.find()
    // console.log(activities)
    // console.log(activities)
    res.json(activities)
})


// router.delete("/delete/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.json({ message: `User ${req.params.id} deleted successfully` });
//     } catch (err) {
//       res.status(500).json({ message: "Something went wrong" });
//     }
//   }
// );

module.exports = router

