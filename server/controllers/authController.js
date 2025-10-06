import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gym_website";

// -----------------------------
// SIGNUP
// -----------------------------
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const usersCollection = req.db.collection("users");
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (await usersCollection.countDocuments()) === 0 ? "super-admin" : "user";

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: result.insertedId, role }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: result.insertedId, name, email, role },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const usersCollection = req.db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// -----------------------------
// GET PROFILE
// -----------------------------
export const getProfile = async (req, res) => {
  try {
    const usersCollection = req.db.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};

// -----------------------------
// GET ALL USERS
// -----------------------------
export const getAllUsers = async (req, res) => {
  try {
    const usersCollection = req.db.collection("users");
    const users = await usersCollection.find({}).toArray();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Failed to load users" });
  }
};

// -----------------------------
// PROMOTE USER
// -----------------------------
export const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usersCollection = req.db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "super-admin") return res.status(400).json({ message: "Cannot promote super-admin" });
    if (user.role === "admin") return res.status(400).json({ message: "User is already admin" });

    await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { role: "admin" } });
    return res.status(200).json({ message: `${user.email} has been promoted to admin` });
  } catch (error) {
    console.error("Promote user error:", error);
    return res.status(500).json({ message: "Server error promoting user" });
  }
};

// -----------------------------
// DEMOTE USER
// -----------------------------
export const demoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usersCollection = req.db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "super-admin") return res.status(400).json({ message: "Cannot demote super-admin" });
    if (user.role === "user") return res.status(400).json({ message: "User is already at lowest role" });

    await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { role: "user" } });
    return res.status(200).json({ message: `${user.email} has been demoted to user` });
  } catch (error) {
    console.error("Demote user error:", error);
    return res.status(500).json({ message: "Server error demoting user" });
  }
};

// -----------------------------
// DELETE USER
// -----------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usersCollection = req.db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "super-admin") return res.status(400).json({ message: "Cannot delete super-admin" });

    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: `${user.email} has been deleted` });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Server error deleting user" });
  }
};
