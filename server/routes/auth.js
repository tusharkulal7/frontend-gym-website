import express from "express";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";
import { MongoClient, ObjectId } from "mongodb";

const router = express.Router();

// MongoDB connection URI
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let usersCollection;

// Connect to MongoDB once at server start
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("gymDB");
    usersCollection = db.collection("users");
    console.log("✅ Connected to MongoDB Users collection");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}
connectDB();

// -----------------------------
// Get user profile (Protected, token-based)
// -----------------------------
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// -----------------------------
// Promote user (Admin only)
// -----------------------------
router.put("/promote/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "super-admin")
      return res.status(400).json({ message: "Cannot promote super-admin" });
    if (user.role === "admin")
      return res.status(400).json({ message: "User is already an admin" });

    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: "admin" } }
    );

    res.json({ message: `${user.email} has been promoted to admin` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------
// Demote user (Super-admin only)
// -----------------------------
router.put("/demote/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "super-admin") {
      return res
        .status(403)
        .json({ message: "Only super-admin can demote users" });
    }

    const { id } = req.params;
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "super-admin")
      return res.status(400).json({ message: "Cannot demote super-admin" });
    if (user.role === "user")
      return res.status(400).json({ message: "User is already at lowest role" });

    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: "user" } }
    );

    res.json({ message: `${user.email} has been demoted to user` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
