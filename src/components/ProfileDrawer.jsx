import { useEffect, useState } from "react";
import { LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDrawer({ open, onClose, user, token, onLogout }) {
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch latest profile whenever drawer opens or user/token changes
  useEffect(() => {
    if (!open || !user || !token) {
      setProfile(user || null);
      setLoading(false);
      return;
    }

    // Avoid fetching if profile already exists
    if (profile) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data?.user || data || user); // fallback to user
      } catch (err) {
        console.error(err);
        setProfile(user); // fallback to App user
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open, user, token, profile]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    onLogout?.();
    onClose?.();
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full text-lg">
        <button
          onClick={onClose}
          className="self-end text-white text-4xl font-extrabold hover:text-red-400 transition-colors"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mt-4 mb-6 text-white">Profile</h2>

        {!user ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4 text-white">
              You need to sign in to view your profile
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-green-500 rounded text-white font-semibold"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <p className="text-yellow-400 text-center">Loading profile...</p>
            )}

            {profile && !loading && (
              <>
                <p className="text-white"><strong>Name:</strong> {profile.name}</p>
                <p className="text-white"><strong>Email:</strong> {profile.email}</p>
                <p className="text-white"><strong>Role:</strong> {profile.role}</p>

                {["admin", "super-admin"].includes(profile.role?.toLowerCase()) && (
                  <button
                    onClick={() => {
                      onClose?.();
                      navigate("/allusers");
                    }}
                    className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-blue-700"
                  >
                    <Users size={22} /> View Users
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="mt-auto flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded text-lg font-semibold hover:bg-red-700"
                >
                  <LogOut size={22} /> Logout
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
