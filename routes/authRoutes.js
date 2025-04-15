const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUser,
  fetchLoggedInUser,
  updateProfile,
} = require("../controller/authControler");


const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// ✅ Basic Auth Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// ✅ Normal User Routes
router.get("/users", authenticateToken, fetchUser);
router.get("/me", authenticateToken, fetchLoggedInUser);
router.put("/profile", authenticateToken, updateProfile);

// ✅ Restricted Routes
router.post(
  "/post-job",
  authenticateToken,
  authorizeRole("Job Poster", "Admin"),
  (req, res) => res.status(200).json({ message: "Job posted successfully!" })
);

router.get(
  "/admin-dashboard",
  authenticateToken,
  authorizeRole("Admin"),
  (req, res) => res.status(200).json({ message: "Welcome to Admin Dashboard" })
);



module.exports = router;
