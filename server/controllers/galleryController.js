import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";

// ✅ Get all gallery items
export const getGallery = async (req, res) => {
  try {
    const db = req.db;
    const gallery = await db.collection("gallery").find({}).toArray();

    // Add URL field
    const itemsWithUrl = gallery.map((item) => ({
      ...item,
      url: item.type === "image"
        ? `images/gallery/${item.filename}`
        : `videos/${item.filename}`,
    }));

    res.json({ success: true, items: itemsWithUrl });
  } catch (err) {
    console.error("❌ Get gallery error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add new gallery items (images/videos)
export const addGallery = async (req, res) => {
  try {
    const db = req.db;
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const galleryItems = req.files.map((file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const type = [".jpg", ".jpeg", ".png", ".gif"].includes(ext)
        ? "image"
        : "video";
      const folder = type === "image" ? "images/gallery" : "videos";

      return {
        filename: file.filename,
        type,
        url: `${folder}/${file.filename}`,
        createdAt: new Date(),
      };
    });

    // Insert into DB
    const result = await db.collection("gallery").insertMany(galleryItems);

    const insertedItems = await db
      .collection("gallery")
      .find({ _id: { $in: Object.values(result.insertedIds) } })
      .toArray();

    res.json({
      success: true,
      message: "Files uploaded successfully",
      items: insertedItems,
    });
  } catch (err) {
    console.error("❌ Add gallery error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete one or multiple gallery items
export const deleteGallery = async (req, res) => {
  try {
    const db = req.db;
    const { ids } = req.body; // Expecting an array of _id strings

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items selected" });
    }

    // Convert to ObjectId safely
    const objectIds = ids
      .map((id) => {
        try {
          return new ObjectId(id);
        } catch (err) {
          console.warn(`⚠️ Invalid ID skipped: ${id}`);
          return null;
        }
      })
      .filter(Boolean);

    if (objectIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid IDs provided" });
    }

    // Fetch items from DB
    const items = await db
      .collection("gallery")
      .find({ _id: { $in: objectIds } })
      .toArray();

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Items not found" });
    }

    // Delete files from disk
    items.forEach((item) => {
      if (!item.url) return;
      const filePath = path.join(process.cwd(), "public", item.url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`✅ Deleted file: ${filePath}`);
        } catch (err) {
          console.error(`❌ Failed to delete file: ${filePath}`, err);
        }
      }
    });

    // Delete from DB
    const deleteResult = await db
      .collection("gallery")
      .deleteMany({ _id: { $in: objectIds } });

    res.json({
      success: true,
      message: "Items deleted successfully",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (err) {
    console.error("❌ Delete gallery error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Modify gallery item (rename or replace file)
export const modifyGallery = async (req, res) => {
  try {
    const db = req.db;
    const objectId = new ObjectId(req.params.id); // ID from URL

    const item = await db.collection("gallery").findOne({ _id: objectId });
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const updateData = {};

    // Rename (title from frontend FormData)
    if (req.body.title) updateData.name = req.body.title;

    // Replace file (if uploaded)
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const type = [".jpg", ".jpeg", ".png", ".gif"].includes(ext)
        ? "image"
        : "video";
      const folder = type === "image" ? "images/gallery" : "videos";
      const url = `${folder}/${req.file.filename}`;

      // Delete old file safely
      if (item.url) {
        const oldPath = path.join(process.cwd(), "public", item.url);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.warn("Failed to delete old file:", oldPath, err);
          }
        }
      }

      updateData.filename = req.file.filename;
      updateData.type = type;
      updateData.url = url;
    }

    updateData.updatedAt = new Date();

    const result = await db.collection("gallery").findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      message: "Item modified successfully",
      item: result.value,
    });
  } catch (err) {
    console.error("❌ Modify gallery error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
