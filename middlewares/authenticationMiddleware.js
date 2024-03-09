import jwt from "jsonwebtoken";
import Admin from "../models/adminSchema.js";

// Authenticating customer using Bearer token
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECERT);

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
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(403).json({ message: "Forbidden - Not an admin" });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
