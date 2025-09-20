import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileDrawer from "./components/ProfileDrawer";
import ScrollToTop from "./components/ScrollToTop";
import AllUsers from "./pages/AllUsers";

import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const [backendMessage, setBackendMessage] = useState("⏳ Connecting to backend...");

  // Load user from localStorage safely
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Check backend connection
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetch("http://localhost:5000/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.text();
      })
      .then((data) => setBackendMessage(`✅ ${data}`))
      .catch((err) => {
        if (err.name !== "AbortError") setBackendMessage("❌ Could not connect to backend");
      });

    return () => controller.abort(); // cancel if component unmounts
  }, [token]);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileOpen(false);
  };

  // Login handler
  const handleLogin = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  return (
    <div className="relative min-h-screen text-white font-agency">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-black bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('/images/gymbg.jpg')" }}
      />
      <div className="fixed inset-0 bg-black opacity-80 z-[-1]" />

      <Router>
        <ScrollToTop /> 
        {/* Header with dynamic profile icon */}
        <Header
          user={user}
          onProfileClick={() => setProfileOpen(true)} // Opens drawer
        />

        {/* Profile Drawer */}
        <ProfileDrawer
          open={profileOpen}               
          onClose={() => setProfileOpen(false)}
          token={token}
          user={user}                      
          onLogout={handleLogout}
        />

        <main className="min-h-[80vh]">
          {/* Backend connection status */}
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
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/gallery"
              element={<Gallery token={token} userRole={user?.role} />}
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/allusers" element={<AllUsers />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
