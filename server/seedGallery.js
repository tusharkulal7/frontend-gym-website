// seedGallery.js
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}

const client = new MongoClient(MONGO_URI);

async function seedGallery() {
  try {
    await client.connect();
    const db = client.db("gymDB");
    const galleryCollection = db.collection("gallery");

    // Clear existing gallery entries
    await galleryCollection.deleteMany({});
    console.log("🗑 Cleared existing gallery items");

    const galleryEntries = [];

    // --------- Images ---------
    const imagesDir = path.join(process.cwd(), "public", "images", "gallery");
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir);
      imageFiles.forEach((file) => {
        galleryEntries.push({
          name: path.parse(file).name,
          filename: file,
          type: "image",
          url: `/images/gallery/${file}`, // store ready-to-use URL
          createdAt: new Date(),
        });
      });
      console.log(`🖼 Found ${imageFiles.length} images`);
    } else {
      console.warn(`⚠️ Images directory not found: ${imagesDir}`);
    }

    // --------- Videos ---------
    const videosDir = path.join(process.cwd(), "public", "videos");
    if (fs.existsSync(videosDir)) {
      const videoFiles = fs.readdirSync(videosDir);
      videoFiles.forEach((file) => {
        galleryEntries.push({
          name: path.parse(file).name,
          filename: file,
          type: "video",
          url: `/videos/${file}`, // store ready-to-use URL
          createdAt: new Date(),
        });
      });
      console.log(`🎬 Found ${videoFiles.length} videos`);
    } else {
      console.warn(`⚠️ Videos directory not found: ${videosDir}`);
    }

    // Insert into MongoDB
    if (galleryEntries.length > 0) {
      const result = await galleryCollection.insertMany(galleryEntries);
      console.log(`✅ Inserted ${result.insertedCount} gallery items`);
    } else {
      console.log("⚠️ No gallery items to insert");
    }
  } catch (err) {
    console.error("❌ Error seeding gallery:", err);
  } finally {
    await client.close();
  }
}

seedGallery();
