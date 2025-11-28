import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { STATIC_IMAGES } from "./constants/staticImages";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Import critical components immediately
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileDrawer from "./components/ProfileDrawer";
import ScrollToTop from "./components/ScrollToTop";
import CustomSignIn from "./components/CustomSignIn";
import OAuthCallback from "./components/OAuthCallback";
import AdminSetup from "./components/AdminSetup";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const AllUsers = lazy(() => import("./pages/AllUsers"));
const ConnectionTest = lazy(() => import("./components/ConnectionTest"));

// ✅ Deployed backend URL

function App() {
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner message="Loading gym website..." />;
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen text-white font-agency overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-black bg-cover bg-center bg-no-repeat z-[-1]"
        style={{ backgroundImage: `url('${STATIC_IMAGES.gymBackground}')` }}
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
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery userRole={user?.publicMetadata?.role} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<ConnectionTest />} />
          <Route path="/admin-setup" element={<AdminSetup />} />

          {/* Clerk Auth Routes - Unified Login (handles both sign-in and sign-up) */}
          <Route
            path="/login"
            element={
              <SignedOut>
                <CustomSignIn />
              </SignedOut>
            }
          />
          {/* Redirect signup to login - unified authentication */}
          <Route
            path="/signup"
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="/sso-callback"
            element={<OAuthCallback />}
          />
          
          {/* Redirect verification to home - no longer needed with unified flow */}
          <Route
            path="/verification"
            element={<Navigate to="/" replace />}
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
        </Suspense>
      </main>

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
