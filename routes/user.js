const express = require("express")
const router = express.Router()
const { registerUser, getUSer, updatePass, loginUser } = require("../controllers/user.js")
const { authMiddleware, authorizeRoles } = require("../middleware/auth.js");


router.post("/user", registerUser)
router.post("/login", loginUser)
router.get("/alluser", authMiddleware, authorizeRoles("admin") ,getUSer)

router.put("/change-password", authMiddleware, updatePass);

router.delete("/delete/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: `User ${req.params.id} deleted successfully` });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = router

