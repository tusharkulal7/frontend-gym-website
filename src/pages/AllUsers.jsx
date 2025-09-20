import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const myName = localStorage.getItem("name");
  const myEmail = localStorage.getItem("email");

  const navigate = useNavigate();

  // Redirect normal users
  useEffect(() => {
    if (!token || !["admin", "super-admin"].includes(role)) {
      navigate("/", { replace: true });
      return;
    }
    fetchUsers();
  }, [token, role, myEmail, myName, navigate]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      let finalUsers = Array.isArray(data) ? data : [];

      // Include own account if missing
      if (myEmail && !finalUsers.some((u) => u.email === myEmail)) {
        finalUsers.push({
          _id: "me",
          name: myName || "You",
          email: myEmail,
          role: role || "user",
        });
      }

      setUsers(finalUsers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Promote user (user → admin)
  const handlePromote = async (email) => {
    if (!window.confirm(`Promote ${email} to admin?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: "admin" } : u))
        );
      } else {
        alert(data.message || "Failed to promote user");
      }
    } catch (err) {
      console.error("Promote error:", err);
    }
  };

  // Demote user (admin → user, super-admin only)
  const handleDemote = async (email) => {
    if (!window.confirm(`Demote ${email} to normal user?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/demote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: "user" } : u))
        );
      } else {
        alert(data.message || "Failed to demote user");
      }
    } catch (err) {
      console.error("Demote error:", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        All Registered Users
      </h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md text-black rounded-md"
      />

      {loading ? (
        <p className="text-white">Loading users...</p>
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
                    {/* Promote */}
                    {u.role === "user" &&
                      ["admin", "super-admin"].includes(role) && (
                        <button
                          onClick={() => handlePromote(u.email)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Promote
                        </button>
                      )}
                    {/* Demote */}
                    {u.role === "admin" && role === "super-admin" && (
                      <button
                        onClick={() => handleDemote(u.email)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                      >
                        Demote
                      </button>
                    )}
                    {/* Delete */}
                    {u.role !== "super-admin" && (
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
