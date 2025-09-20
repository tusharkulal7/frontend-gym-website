// index.js
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

import galleryRoutes from "./routes/gallery.js";
import { verifyToken, adminOnly } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey123";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// MongoDB client
// -----------------------------
const client = new MongoClient(MONGO_URI); // ✅ Modern usage without deprecated options
let db, users;

async function start() {
  try {
    await client.connect();
    db = client.db("gymDB");
    users = db.collection("users");
    console.log("✅ Connected to MongoDB Atlas");

    // Attach db to req
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // -----------------------------
// Serve static files
// -----------------------------
// ✅ point directly to /server/public/images and /server/public/videos
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

    // -----------------------------
    // Auth & User Routes
    // -----------------------------
    app.post("/api/signup", async (req, res) => {
      try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
          return res.status(400).json({ message: "Name, email, and password are required" });

        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = (await users.countDocuments()) === 0 ? "super-admin" : "user";

        await users.insertOne({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: `User created successfully with role: ${role}` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password)
          return res.status(400).json({ message: "Email and password are required" });

        const user = await users.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
          { id: user._id, role: user.role, name: user.name, email: user.email },
          JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ token, role: user.role, name: user.name, email: user.email });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/api/users", verifyToken, async (req, res) => {
      try {
        const { role, id } = req.user;
        let allUsers = [];
        if (["super-admin", "admin"].includes(role)) {
          allUsers = await users.find({}, { projection: { password: 0 } }).toArray();
        } else {
          const user = await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
          if (user) allUsers = [user];
        }
        res.json(allUsers);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/promote", verifyToken, adminOnly, async (req, res) => {
      try {
        const { targetEmail } = req.body;
        if (!targetEmail) return res.status(400).json({ message: "Target email required" });

        const targetUser = await users.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ message: "User not found" });
        if (targetUser.role === "super-admin")
          return res.status(400).json({ message: "Cannot modify super-admin" });

        await users.updateOne({ email: targetEmail }, { $set: { role: "admin" } });
        res.json({ message: `${targetEmail} has been promoted to admin` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/api/demote", verifyToken, adminOnly, async (req, res) => {
      try {
        const { targetEmail } = req.body;
        if (!targetEmail) return res.status(400).json({ message: "Target email required" });

        const targetUser = await users.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ message: "User not found" });
        if (targetUser.role === "super-admin")
          return res.status(400).json({ message: "Cannot demote super-admin" });

        await users.updateOne({ email: targetEmail }, { $set: { role: "user" } });
        res.json({ message: `${targetEmail} has been demoted to user` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.delete("/api/delete/:id", verifyToken, adminOnly, async (req, res) => {
      try {
        const { id } = req.params;
        const targetUser = await users.findOne({ _id: new ObjectId(id) });
        if (!targetUser) return res.status(404).json({ message: "User not found" });
        if (targetUser.role === "super-admin")
          return res.status(400).json({ message: "Cannot delete super-admin" });

        await users.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: `User ${targetUser.email} has been deleted` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/api/profile", verifyToken, async (req, res) => {
      try {
        const user = await users.findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // -----------------------------
    // Gallery Routes
    // -----------------------------
    app.use("/api/gallery", galleryRoutes);

    // -----------------------------
    // Default root route
    // -----------------------------
    app.get("/", (req, res) => {
      res.send("✅ Gym backend is running. Use /api routes.");
    });

    // -----------------------------
    // Start server
    // -----------------------------
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

start();
