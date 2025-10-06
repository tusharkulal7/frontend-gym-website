import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // -----------------------------
  // API call helper
  // -----------------------------
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token missing");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) throw new Error(data.message || "API call failed");
    return data;
  };

  // -----------------------------
  // Fetch users
  // -----------------------------
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await apiCall("http://localhost:5000/api/auth/all-users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    if (!["admin", "super-admin"].includes(currentUser.role)) {
      navigate("/", { replace: true });
      return;
    }

    fetchUsers();
  }, [currentUser, navigate, fetchUsers]);

  // -----------------------------
  // Promote, Demote, Delete
  // -----------------------------
  const handlePromote = async (id, email) => {
    if (currentUser.role !== "super-admin") return;
    if (!window.confirm(`Promote ${email} to admin?`)) return;

    try {
      const data = await apiCall(`http://localhost:5000/api/auth/promote/${id}`, {
        method: "PUT",
      });
      alert(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to promote");
    }
  };

  const handleDemote = async (id, email) => {
    if (currentUser.role !== "super-admin") return;
    if (!window.confirm(`Demote ${email} to user?`)) return;

    try {
      const data = await apiCall(`http://localhost:5000/api/auth/demote/${id}`, {
        method: "PUT",
      });
      alert(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "user" } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to demote");
    }
  };

  const handleDelete = async (id, email) => {
    if (currentUser.role !== "super-admin") return;
    if (!window.confirm(`Delete ${email}?`)) return;

    try {
      const data = await apiCall(`http://localhost:5000/api/auth/delete/${id}`, {
        method: "DELETE",
      });
      alert(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  // -----------------------------
// Filter users by name only
// -----------------------------
const filteredUsers = users.filter((u) =>
  u.name?.toLowerCase().includes(search.trim().toLowerCase())
);


  // -----------------------------
  // Render
  // -----------------------------
  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-white text-lg">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6 text-white">All Registered Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md text-black rounded-md"
      />

      {loading ? (
        <p className="text-white">Loading users...</p>
      ) : message ? (
        <p className="text-red-400">{message}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2 border">Sl No</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-2 border text-white">{index + 1}</td>
                  <td className="px-4 py-2 border text-white">{u.name}</td>
                  <td className="px-4 py-2 border text-white">{u.email}</td>
                  <td className="px-4 py-2 border text-white capitalize">{u.role}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    {currentUser.role === "super-admin" && u.role === "user" && (
                      <button
                        onClick={() => handlePromote(u._id, u.email)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Promote
                      </button>
                    )}
                    {currentUser.role === "super-admin" && u.role === "admin" && (
                      <button
                        onClick={() => handleDemote(u._id, u.email)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                      >
                        Demote
                      </button>
                    )}
                    {currentUser.role === "super-admin" && u.role !== "super-admin" && (
                      <button
                        onClick={() => handleDelete(u._id, u.email)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
