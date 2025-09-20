import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setMessage("Please login to access profile");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading)
    return (
      <p className="text-center mt-20 text-yellow-400 text-lg font-medium">
        {message || "Loading profile..."}
      </p>
    );

  if (!profile)
    return (
      <p className="text-center mt-20 text-red-400 text-lg font-medium">
        {message || "Profile not available"}
      </p>
    );

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      <div className="space-y-4 text-lg">
        <p>
          <strong className="font-semibold">Name:</strong> {profile.name}
        </p>
        <p>
          <strong className="font-semibold">Email:</strong> {profile.email}
        </p>
        <p>
          <strong className="font-semibold">Role:</strong> {profile.role}
        </p>
      </div>
    </div>
  );
}
