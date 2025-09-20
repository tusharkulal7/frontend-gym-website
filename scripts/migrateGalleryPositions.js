import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load the correct .env file
dotenv.config({ path: path.join(__dirname, "../server/.env") });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI not found in server/.env");
  process.exit(1);
}

const client = new MongoClient(uri);

async function migrate() {
  try {
    await client.connect();
    const db = client.db("gymDB"); // <- your DB name
    const gallery = db.collection("gallery");

    const items = await gallery.find({}).toArray();

    if (!items.length) {
      console.log("⚠️ No items found in gallery collection");
      return;
    }

    console.log(`Found ${items.length} items. Adding 'position' field...`);

    for (let i = 0; i < items.length; i++) {
      await gallery.updateOne(
        { _id: items[i]._id },
        { $set: { position: i } }
      );
    }

    console.log("✅ Migration complete: all gallery items now have a 'position' field.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await client.close();
  }
}

migrate();
