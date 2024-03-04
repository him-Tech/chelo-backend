import jwt from "jsonwebtoken";
import Admin from "../models/adminSchema.js";

// Authenticating customer using Bearer token
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECERT);

    console.log("Decoded Token (requireSignIn):", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in requireSignIn:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Not logged in" });
    }

    console.log("Decoded Token (requireAdmin):", req.user);

    const admin = await Admin.findById(req.user._id);
    console.log("Admin found:", admin);

    if (!admin) {
      return res.status(403).json({ message: "Forbidden - Not an admin" });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
