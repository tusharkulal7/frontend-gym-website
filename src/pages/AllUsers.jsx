import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import logger from "../utils/logger";

export default function AllUsers() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isSignedIn } = useClerk();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const maxRetries = 5;

  // -----------------------------
  // Fetch users using Clerk API
  // -----------------------------
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");
      
      // Debug: Log environment and auth state
      logger.info("Backend URL:", process.env.REACT_APP_BACKEND_URL);
      logger.info("User loaded:", isLoaded);
      logger.info("User exists:", !!user);
      logger.info("User role:", user?.publicMetadata?.role);
      
      if (!isLoaded || !user) {
        setMessage("User session loading...");
        return;
      }

      if (!getToken || typeof getToken !== 'function') {
        setMessage("Initializing authentication...");
        return;
      }

      const token = await getToken();
      if (!token) {
        logger.warn("No token available, skipping users fetch");
        setMessage("Authentication token not available. Please sign in again.");
        return;
      }

      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (!backendUrl) {
        logger.error("REACT_APP_BACKEND_URL is not configured");
        setMessage("Backend URL is not configured. Please check environment variables.");
        return;
      }

      const fullUrl = `${backendUrl}/api/auth/all-users`;
      logger.info("Fetching from URL:", fullUrl);

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      logger.info("Response status:", res.status);
      logger.info("Response headers:", res.headers);
      
      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          logger.error("Failed to fetch users:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          logger.error("Could not parse error response:", e);
        }
        setMessage(errorMessage);
        return;
      }
      
      const data = await res.json();
      logger.info("Response data type:", typeof data);
      logger.info("Response is array:", Array.isArray(data));
      logger.debug("Fetched users (full response):", data);
      logger.info("Number of users received:", Array.isArray(data) ? data.length : 0);
      
      if (!Array.isArray(data)) {
        logger.error("Response is not an array:", data);
        setMessage("Invalid response format from server");
        return;
      }
      
      setUsers(data);
      if (data.length === 0) {
        setMessage("No users found. Make sure users are registered in Clerk.");
      }
    } catch (err) {
      logger.error("Fetch error:", err);
      logger.error("Error stack:", err.stack);
      setMessage(err.message || "Failed to fetch users. Check console for details.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, user]);

  // Set timeout for fetch operation
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setMessage("Taking longer than expected. Please refresh or check your connection.");
      }
    }, 8000);
    
    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  // Clerk initialization and user fetch
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    
    const initAuth = async () => {
      try {
        if (!isMounted) return;
        
        logger.info("AllUsers useEffect triggered");
        logger.info("isLoaded:", isLoaded);
        logger.info("user exists:", !!user);
        logger.info("user role:", user?.publicMetadata?.role);
        
        if (!isLoaded || !user) {
          logger.info("User not loaded yet, waiting...");
          return;
        }

        // Check user role first
        const userRole = user.publicMetadata?.role;
        logger.info("User role check:", userRole);
        
        if (!["admin", "super-admin"].includes(userRole)) {
          logger.warn("User not authorized, redirecting to home");
          setMessage(`Access denied. Current role: ${userRole || 'none'}. Required: admin or super-admin.`);
          setTimeout(() => navigate("/", { replace: true }), 2000);
          return;
        }

        // Try to get token with retry logic
        const attemptFetch = async (attempt = 0) => {
          if (!isMounted) return;
          
          try {
            logger.info(`Attempt ${attempt + 1} to get token`);
            
            // Get token directly without checking getToken function
            const token = await getToken();
            
            if (token) {
              logger.info("Token obtained successfully, fetching users...");
              await fetchUsers();
              return;
            }
            
            throw new Error("Token is null");
            
          } catch (error) {
            logger.warn(`Token fetch attempt ${attempt + 1} failed:`, error.message);
            
            if (attempt < maxRetries - 1) {
              // Exponential backoff
              const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
              logger.info(`Retrying in ${delay}ms...`);
              
              return new Promise(resolve => {
                timeoutId = setTimeout(async () => {
                  if (isMounted) {
                    await attemptFetch(attempt + 1);
                    resolve();
                  }
                }, delay);
              });
            } else {
              logger.error("Max retries reached, giving up");
              if (isMounted) {
                setMessage("Failed to authenticate. Please refresh the page and try again.");
                setLoading(false);
              }
            }
          }
        };

        // Start the retry process
        attemptFetch(0);
        
      } catch (error) {
        logger.error("Error in auth initialization:", error);
        if (isMounted) {
          setMessage("An error occurred while initializing authentication.");
          setLoading(false);
        }
      }
    };
    
    initAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, isLoaded, isSignedIn, navigate, getToken, fetchUsers]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {};
  }, []);

  // -----------------------------
  // Promote, Demote, Delete
  // -----------------------------
  const handlePromote = async (id, email) => {
    if (user.publicMetadata?.role !== "super-admin") return;
    if (!window.confirm(`Promote ${email} to admin?`)) return;

    if (!getToken || typeof getToken !== 'function') {
      alert("Authentication error. Please refresh the page and try again.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        alert("Unable to get authentication token. Please sign in again.");
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/promote/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to promote");
    }
  };

  const handleDemote = async (id, email) => {
    if (user.publicMetadata?.role !== "super-admin") return;
    if (!window.confirm(`Demote ${email} to user?`)) return;

    if (!getToken || typeof getToken !== 'function') {
      alert("Authentication error. Please refresh the page and try again.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        alert("Unable to get authentication token. Please sign in again.");
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/demote/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: "user" } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to demote");
    }
  };

  const handleDelete = async (id, email) => {
    if (user.publicMetadata?.role !== "super-admin") return;
    if (!window.confirm(`Delete ${email}?`)) return;

    if (!getToken || typeof getToken !== 'function') {
      alert("Authentication error. Please refresh the page and try again.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        alert("Unable to get authentication token. Please sign in again.");
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      alert(data.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  // -----------------------------
  // Filter users by name or email
  // -----------------------------
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
    u.email?.toLowerCase().includes(search.trim().toLowerCase())
  );

  // -----------------------------
  // Render
  // -----------------------------
  if (!isLoaded || !user) {
    return (
      <div className="text-center py-10">
        <p className="text-white text-lg">Loading user info...</p>
      </div>
    );
  }

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
                  key={u.id}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-2 border text-white">{index + 1}</td>
                  <td className="px-4 py-2 border text-white">{u.name}</td>
                  <td className="px-4 py-2 border text-white">{u.email}</td>
                  <td className="px-4 py-2 border text-white capitalize">
                    {u.role}
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    {user.publicMetadata?.role === "super-admin" && u.role === "user" && (
                      <button
                        onClick={() => handlePromote(u.id, u.email)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Promote
                      </button>
                    )}
                    {user.publicMetadata?.role === "super-admin" && u.role === "admin" && (
                      <button
                        onClick={() => handleDemote(u.id, u.email)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                      >
                        Demote
                      </button>
                    )}
                    {user.publicMetadata?.role === "super-admin" && u.role !== "super-admin" && (
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
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
