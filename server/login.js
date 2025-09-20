// login.js
import fetch from "node-fetch"; // make sure node-fetch is installed
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:5000";
const email = "tusharkulal7@gmail.com";  // your user
const password = "yourPasswordHere";     // replace with real password

async function loginAndFetchUsers() {
  try {
    // 1️⃣ Login
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || "Login failed");

    const token = loginData.token;
    console.log("✅ Logged in successfully. JWT token:", token);

    // 2️⃣ Fetch all users
    const usersRes = await fetch(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const usersData = await usersRes.json();
    if (!usersRes.ok) throw new Error(usersData.message || "Failed to fetch users");

    console.log("📄 Users:", usersData);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

loginAndFetchUsers();
