import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Itinerary from "../Models/Itinerary.js";
import Activity from "../Models/Activity.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import reAuthMiddleware from "../Middleware/reAuthMiddleware.js";

const router = Router();

// Auth functions

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be completed." });
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT (short term)
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    // Generate refresh token (long term)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Save refresh to user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken: token,
      refreshToken: refreshToken,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.header("Authorization")?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Find user with the decoded id
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.json({
      message: "Refreshed token successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { username, password, email } = req.body; //retrieve input vars

  if (!email || !password || !username) {
    return res.status(400).json({ error: "All fields must be completed." });
  }

  try {
    //check if username or email is in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword, email });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = req.reAuth;

    // Change the password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();

    res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = req.reAuth;
    const userId = user._id;

    // Delete user & documents
    await Itinerary.deleteMany({ userId });
    await Activity.deleteMany({ userId });
    await user.deleteOne();

    res.status(201).json({ message: "Account successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Routes

router.get("/", authMiddleware, getUser); // Protected
router.patch(
  "/update-password",
  authMiddleware,
  reAuthMiddleware,
  changePassword
); // Protected + re-auth
router.delete("/", authMiddleware, reAuthMiddleware, deleteAccount); // Protected + re-auth
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/register", register);

export default router;
