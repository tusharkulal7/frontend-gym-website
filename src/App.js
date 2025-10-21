import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileDrawer from "./components/ProfileDrawer";
import ScrollToTop from "./components/ScrollToTop";
import CustomSignIn from "./components/CustomSignIn";
import CustomSignUp from "./components/CustomSignUp";
import AdminSetup from "./components/AdminSetup";

import AllUsers from "./pages/AllUsers";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ConnectionTest from "./components/ConnectionTest";

// ✅ Deployed backend URL

function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [backendMessage, setBackendMessage] = useState("⏳ Connecting to backend...");

  const { user, isLoaded } = useUser();

  // Check backend connection
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const checkBackend = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/`, { signal });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.text();
        setBackendMessage(`✅ ${data}`);
      } catch (err) {
        if (err.name !== "AbortError") setBackendMessage("❌ Could not connect to backend");
      }
    };

    checkBackend();
    return () => controller.abort();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
      <Header user={user} onProfileClick={() => setProfileOpen(true)} />

      {/* Profile Drawer */}
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
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
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery userRole={user?.publicMetadata?.role} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<ConnectionTest />} />
          <Route path="/admin-setup" element={<AdminSetup />} />

          {/* Clerk Auth Routes */}
          <Route
            path="/login"
            element={
              <SignedOut>
                <CustomSignIn />
              </SignedOut>
            }
          />
          <Route
            path="/signup"
            element={
              <SignedOut>
                <CustomSignUp />
              </SignedOut>
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/allusers"
            element={
              <SignedIn>
                {user && ["admin", "super-admin"].includes(user?.publicMetadata?.role) ? (
                  <AllUsers currentUser={user} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-lg mb-4">
                      You need to sign in as admin to view this page
                    </p>
                  </div>
                )}
              </SignedIn>
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
