import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // basic guard for JWT secret
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Not authorized, token invalid" });
      }

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Not authorized, token expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Not authorized, token invalid" });
      }
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Not authorized, authentication failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};
