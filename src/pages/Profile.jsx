import { useEffect, useState } from "react";

export default function Profile({ user, token, onLogout }) {
  const [profileData, setProfileData] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    if (!user || !token) {
      setProfileData(null);
      setMessage("You need to sign in to view your profile");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setMessage("Loading profile...");
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfileData(data.user || data);
        setMessage("");
      } catch (err) {
        console.error(err);
        setProfileData(null);
        setMessage(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    onLogout?.();
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-yellow-400 text-lg font-medium">
        {message || "Loading profile..."}
      </p>
    );

  if (!profileData)
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4 text-white">{message}</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      <div className="space-y-4 text-lg">
        <p>
          <strong className="font-semibold">Name:</strong> {profileData.name}
        </p>
        <p>
          <strong className="font-semibold">Email:</strong> {profileData.email}
        </p>
        <p>
          <strong className="font-semibold">Role:</strong> {profileData.role}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 w-full px-4 py-2 bg-red-500 rounded text-white font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
