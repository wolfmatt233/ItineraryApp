import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({ message: "Authorization is denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; //Attach user info from the token
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.name, error.message); // Log error details
    res.status(403).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
