import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "gym_website";

/**
 * Middleware: Verify JWT token from Authorization header
 * Expects header: Authorization: Bearer <token>
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res
        .status(401)
        .json({ message: "Unauthorized: missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized: missing token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * Middleware: Attach full user info from MongoDB to req.user
 * @param {MongoClient.Db} db - MongoDB database instance
 */
export function attachUserRole(db) {
  if (!db) throw new Error("attachUserRole: MongoDB database instance is required");

  return async (req, res, next) => {
    try {
      if (!req.user?.id)
        return res.status(401).json({ message: "Unauthorized: missing user ID" });

      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });

      if (!user)
        return res.status(403).json({ message: "User not found in database" });

      // Attach full user info
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      console.error("attachUserRole error:", err);
      return res.status(500).json({ message: "Server error fetching user role" });
    }
  };
}

/**
 * Middleware: Allow specific roles only
 * @param  {...string} allowedRoles
 */
export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    } catch (err) {
      console.error("allowRoles error:", err);
      return res.status(500).json({ message: "Server error in role check" });
    }
  };
}

/**
 * Middleware: Admin access only (admin or super-admin)
 */
export function adminOnly(req, res, next) {
  try {
    const role = req.user?.role;
    if (role === "admin" || role === "super-admin") return next();
    return res.status(403).json({ message: "Admin access only" });
  } catch (err) {
    console.error("adminOnly error:", err);
    return res.status(500).json({ message: "Server error in admin check" });
  }
}

/**
 * Middleware: Super-admin access only
 */
export function superAdminOnly(req, res, next) {
  try {
    if (req.user?.role === "super-admin") return next();
    return res.status(403).json({ message: "Super-admin access only" });
  } catch (err) {
    console.error("superAdminOnly error:", err);
    return res.status(500).json({ message: "Server error in super-admin check" });
  }
}

// ✅ Export everything
export default {
  verifyToken,
  attachUserRole,
  allowRoles,
  adminOnly,
  superAdminOnly,
};
