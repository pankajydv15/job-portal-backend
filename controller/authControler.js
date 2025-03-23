const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, number, role } = req.body; // ✅ Role added
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!firstName || !lastName || !email || !password || !role) { // ✅ Role check added
    return res.status(400).json({ message: "All fields are required, including role" });
  }

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      number,
      role: req.body.role || "Job Seeker", // ✅ Assigning role during signup
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log("Error During signup: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role, // ✅ Return role in response
    });
  } catch (error) {
    console.log("Error During login: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Middleware to protect routes based on role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

const fetchUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const fetchLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// ✅ Profile update remains the same
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== "") user[key] = profileData[key];
    });

    const updatedUser = await user.save();

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, fetchUser, fetchLoggedInUser, updateProfile, authorizeRoles };
