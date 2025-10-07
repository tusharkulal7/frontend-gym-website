import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileDrawer from "./components/ProfileDrawer";
import ScrollToTop from "./components/ScrollToTop";

import AllUsers from "./pages/AllUsers";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ✅ Deployed backend URL
const BACKEND_URL = "https://gym-website-backend-qvbe.onrender.com";

function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [backendMessage, setBackendMessage] = useState("⏳ Connecting to backend...");
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Check backend connection
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const checkBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal,
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.text();
        setBackendMessage(`✅ ${data}`);
      } catch (err) {
        if (err.name !== "AbortError") setBackendMessage("❌ Could not connect to backend");
      }
    };

    checkBackend();
    return () => controller.abort();
  }, [token]);

  // Handle login
  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
    setProfileOpen(false);
  };

  return (
    <div className="relative min-h-screen text-white font-agency">
      {/* Background */}
      <div
        className="fixed inset-0 bg-black bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('/images/gymbg.jpg')" }}
      />
      <div className="fixed inset-0 bg-black opacity-80 z-[-1]" />

      <ScrollToTop />

      {/* Header */}
      <Header user={currentUser} onProfileClick={() => setProfileOpen(true)} />

      {/* Profile Drawer */}
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={currentUser}
        token={token}
        onLogout={handleLogout}
      />

      <main className="min-h-[80vh]">
        {/* Backend status */}
        <p
          className={`text-center py-2 font-bold ${
            backendMessage.startsWith("✅")
              ? "text-green-400"
              : backendMessage.startsWith("❌")
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {backendMessage}
        </p>

        <Routes>
          <Route path="/" element={<Home user={currentUser} token={token} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery token={token} userRole={currentUser?.role} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

          {/* Protected Admin Route */}
          <Route
            path="/allusers"
            element={
              currentUser && ["admin", "super-admin"].includes(currentUser?.role) ? (
                <AllUsers currentUser={currentUser} token={token} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg mb-4">
                    You need to sign in as admin to view this page
                  </p>
                </div>
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
