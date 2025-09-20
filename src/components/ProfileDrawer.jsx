import { useEffect, useState } from "react";
import { LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDrawer({ open, onClose, token, onLogout }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch profile whenever drawer opens and token exists
  useEffect(() => {
    if (!token || !open) {
      setUser(null);
      setMessage("");
      return;
    }

    const fetchProfile = async () => {
      setMessage("Loading profile...");
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized. Logging out...");
          }
          if (res.status === 404) {
            throw new Error("Profile not found. Logging out...");
          }
          throw new Error("Failed to fetch profile.");
        }

        const data = await res.json();
        setUser(data);
        setMessage("");
      } catch (err) {
        setMessage(`❌ ${err.message}`);
        setUser(null);

        // Force logout after 1.5s and redirect
        setTimeout(() => {
          if (onLogout) onLogout();
          navigate("/");
        }, 1500);
      }
    };

    fetchProfile();
  }, [token, open, navigate, onLogout]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    setUser(null);
    onClose();
    navigate("/"); // redirect to homepage
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full text-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end text-white text-4xl font-extrabold hover:text-red-400 transition-colors"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mt-4 mb-6 text-white">Profile</h2>

        {/* Loading or error */}
        {!user && <p className="text-yellow-400">{message || "Please log in."}</p>}

        {/* Profile Info */}
        {user && (
          <>
            <p className="text-white">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-white">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-white">
              <strong>Role:</strong> {user.role}
            </p>

            {/* View Users button for admin/super-admin */}
            {["admin", "super-admin"].includes(user.role.toLowerCase()) && (
              <button
                onClick={() => {
                  onClose();
                  navigate("/allusers");
                }}
                className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-blue-700"
              >
                <Users size={22} /> View Users
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-red-700"
            >
              <LogOut size={22} /> Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
