import express from "express";
import {
  signupUser,
  loginUser,
  getProfile,
  promoteUser,
  demoteUser,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";

import { verifyToken, attachUserRole, adminOnly, superAdminOnly } from "../middleware/authMiddleware.js";

// Attach db to req
const attachDB = (db) => (req, res, next) => {
  req.db = db;
  next();
};

export default function authRoutes(db) {
  const router = express.Router();

  router.post("/signup", signupUser);
  router.post("/login", loginUser);

  router.get("/profile", verifyToken, attachDB(db), attachUserRole(db), getProfile);

  router.get("/all-users", verifyToken, attachDB(db), attachUserRole(db), adminOnly, getAllUsers);

  router.put("/promote/:id", verifyToken, attachDB(db), attachUserRole(db), adminOnly, promoteUser);
  router.put("/demote/:id", verifyToken, attachDB(db), attachUserRole(db), superAdminOnly, demoteUser);
  router.delete("/delete/:id", verifyToken, attachDB(db), attachUserRole(db), superAdminOnly, deleteUser);

  return router;
}
