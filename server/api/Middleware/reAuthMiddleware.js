import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";

const reAuthMiddleware = async (req, res, next) => {
  const { email, password } = req.body;
  const refreshToken = req.header("Authorization")?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    // No email exists or email does not match current user
    if (!user || user._id != decodedToken.id) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    req.reAuth = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

export default reAuthMiddleware;
