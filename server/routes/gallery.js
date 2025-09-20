// server/routes/gallery.js
import express from "express";
import multer from "multer";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import fs from "fs";

const router = express.Router();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let galleryCollection;

// Connect to DB once
async function connectDB() {
  if (!galleryCollection) {
    await client.connect();
    const db = client.db("gymDB");
    galleryCollection = db.collection("gallery");
  }
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image");
    const folder = isImage ? "public/images/gallery" : "public/videos";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// GET all gallery items (sorted by position then createdAt)
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const dbItems = await galleryCollection.find({}).sort({ position: 1, createdAt: 1 }).toArray();
    res.status(200).json({ success: true, items: dbItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch gallery", error: err.message });
  }
});

// POST upload new gallery items
router.post(
  "/upload",
  verifyToken,
  allowRoles("admin", "super-admin"),
  upload.array("files"),
  async (req, res) => {
    try {
      await connectDB();
      const files = req.files;
      if (!files || files.length === 0) return res.status(400).json({ success: false, message: "No files uploaded" });

      // find current max position
      const top = await galleryCollection.find({}).sort({ position: -1 }).limit(1).toArray();
      let nextPos = top.length ? (Number(top[0].position) + 1) : 0;

      const docs = files.map((file) => {
        const type = file.mimetype.startsWith("image") ? "image" : "video";
        const url = path.join(type === "image" ? "images/gallery" : "videos", file.filename).replace(/\\/g, "/");
        return {
          filename: file.filename,
          url,
          type,
          createdAt: new Date(),
          position: nextPos++,
        };
      });

      const result = await galleryCollection.insertMany(docs);
      const insertedIds = Object.values(result.insertedIds); // array of ObjectId
      const insertedDocs = await galleryCollection.find({ _id: { $in: insertedIds } }).toArray();

      res.status(201).json({ success: true, message: "Files uploaded successfully", items: insertedDocs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Upload failed", error: err.message });
    }
  }
);


// PUT update gallery item (optional new file)
router.put("/:id", verifyToken, allowRoles("admin", "super-admin"), upload.single("file"), async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { title } = req.body;

    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid gallery ID" });

    const item = await galleryCollection.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });

    const updateData = {};
    if (title) updateData.title = title;

    if (req.file) {
      const type = req.file.mimetype.startsWith("image") ? "image" : "video";
      const url = path.join(type === "image" ? "images/gallery" : "videos", req.file.filename).replace(/\\/g, "/");

      // delete old file safely
      if (item.url) {
        const oldFilePath = path.join(process.cwd(), "public", item.url);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }

      updateData.url = url;
      updateData.type = type;
    }

    updateData.updatedAt = new Date();

    const result = await galleryCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    res.status(200).json({ success: true, message: "Gallery updated", item: result.value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
});

// DELETE single gallery item
router.delete("/:id", verifyToken, allowRoles("admin", "super-admin"), async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid gallery ID" });

    const item = await galleryCollection.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });

    if (item.url) {
      const filePath = path.join(process.cwd(), "public", item.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await galleryCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: "Gallery item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
});

// DELETE multiple gallery items (bulk)
router.delete("/", verifyToken, allowRoles("admin", "super-admin"), async (req, res) => {
  try {
    await connectDB();
    const { ids } = req.body; // array of IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No IDs provided" });
    }

    const objectIds = ids.map((id) => new ObjectId(id));
    const items = await galleryCollection.find({ _id: { $in: objectIds } }).toArray();

    // Delete files safely
    items.forEach((item) => {
      if (item.url) {
        const filePath = path.join(process.cwd(), "public", item.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await galleryCollection.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({ success: true, message: `${items.length} items deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Bulk delete failed", error: err.message });
  }
});

// PATCH reorder gallery items
router.patch(
  "/reorder",
  verifyToken,
  allowRoles("admin", "super-admin"),
  async (req, res) => {
    try {
      await connectDB();
      const { items } = req.body; // expect [{ _id: "<id>", position: 0 }, ...]

      if (!Array.isArray(items)) return res.status(400).json({ success: false, message: "Invalid items" });

      const bulkOps = items.map((it) => ({
        updateOne: {
          filter: { _id: new ObjectId(it._id) },
          update: { $set: { position: Number(it.position) } },
        },
      }));

      if (bulkOps.length) await galleryCollection.bulkWrite(bulkOps);

      res.json({ success: true, message: "Reorder saved" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Reorder failed", error: err.message });
    }
  }
);


export default router;
