import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import galleryRoutes from "./routes/gallery.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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
const client = new MongoClient(MONGO_URI);
let db;

async function start() {
  try {
    await client.connect();
    db = client.db("gymDB");
    console.log("✅ Connected to MongoDB");

    // -----------------------------
    // Attach db to req (global)
    // -----------------------------
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // -----------------------------
    // Serve static files
    // -----------------------------
    app.use("/images", express.static(path.join(__dirname, "public/images")));
    app.use("/videos", express.static(path.join(__dirname, "public/videos")));

    // -----------------------------
    // API routes
    // -----------------------------
    app.use("/api/auth", authRoutes(db)); // signup, login, profile, promote, demote, all-users, delete
    app.use("/api/gallery", galleryRoutes);

    // Default route
    app.get("/", (req, res) => {
      res.send("✅ Gym backend is running. Use /api routes.");
    });

    // Start server
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

start();
