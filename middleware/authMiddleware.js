import jwt from "jsonwebtoken";
import User from "../models/User.js";
import e from "express";

 const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (optional: exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next(); // allow access
    } catch (err) {
      console.error("JWT auth error:", err.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "Authorization token missing" });
  }
};

export default protect;
