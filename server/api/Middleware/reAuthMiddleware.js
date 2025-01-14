import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";

const reAuthMiddleware = async (req, res, next) => {
  const { email, password } = req.body;
  const refreshToken = req.header("Authorization")?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    // No email exists or email does not match current user
    if (!user || user._id != decodedToken.id) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    req.reAuth = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error" });
  }
};

export default reAuthMiddleware;
