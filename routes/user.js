const express = require("express")
const router = express.Router()
const { registerUser, getUSer, updatePass, loginUser, forgotPassword, resetPassword } = require("../controllers/user.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js");


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/alluser", authMiddleware, authorizeRoles("admin") ,getUSer)

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.put("/change-password", authMiddleware, updatePass);

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

