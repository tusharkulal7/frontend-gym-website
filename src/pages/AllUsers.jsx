import { useEffect, useState, useCallback } from "react";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({
    action: null,
    id: null,
    email: "",
    title: "",
    message: ""
  });
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
  // Show Confirmation Dialog
  // -----------------------------
  const showConfirmation = (action, id, email) => {
    if (user.publicMetadata?.role !== "super-admin") return;
    
    const actionConfig = {
      promote: {
        title: "Promote User",
        message: `Promote ${email} to admin?`
      },
      demote: {
        title: "Demote User",
        message: `Demote ${email} to user?`
      }
    };

    setConfirmData({
      action,
      id,
      email,
      title: actionConfig[action].title,
      message: actionConfig[action].message
    });
    setShowConfirm(true);
  };

  // Handle confirmation dialog close
  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setConfirmData({
      action: null,
      id: null,
      email: "",
      title: "",
      message: ""
    });
  };

  // Handle confirmation
  const handleConfirm = async () => {
    const { action } = confirmData;
    
    if (action === 'delete') {
      await handleDelete();
      return;
    }
    
    const { id } = confirmData;
    setShowConfirm(false);
    setMessage("Processing...");

    try {
      if (!getToken || typeof getToken !== 'function') {
        throw new Error("Authentication error. Please refresh the page and try again.");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Unable to get authentication token. Please sign in again.");
      }

      const endpoint = action === 'promote' ? 'promote' : 'demote';
      const newRole = action === 'promote' ? 'admin' : 'user';
      
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/${endpoint}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}: ${rawText}`);
        }
        data = { message: `User ${action}d successfully` };
      }

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${action} user`);
      }

      // Update UI immediately
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
      );
      
      setMessage(data.message || `User ${action}d successfully`);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error(`${action} error:`, err);
      setMessage(err.message || `Failed to ${action} user`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Handle promote/demote button clicks
  const handlePromote = (id, email) => {
    showConfirmation('promote', id, email);
  };

  const handleDemote = (id, email) => {
    showConfirmation('demote', id, email);
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (id, email) => {
    if (user.publicMetadata?.role !== "super-admin") return;
    
    setConfirmData({
      action: 'delete',
      id,
      email,
      title: "Delete User",
      message: `Are you sure you want to delete ${email}? This action cannot be undone.`
    });
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    const { id } = confirmData;
    setShowConfirm(false);
    setMessage("Processing...");

    try {
      if (!getToken || typeof getToken !== 'function') {
        throw new Error("Authentication error. Please refresh the page and try again.");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Unable to get authentication token. Please sign in again.");
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

      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const rawText = await res.text();
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}: ${rawText}`);
        }
        data = { message: "User deleted successfully" };
      }

      if (!res.ok) {
        throw new Error(data.message || `Failed to delete user`);
      }

      // Update UI immediately
      setUsers(prev => prev.filter(u => u.id !== id));
      setMessage(data.message || "User deleted successfully");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.message || "Failed to delete user");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // -----------------------------
  // Filter users by name, email, or role
  // -----------------------------
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
    u.email?.toLowerCase().includes(search.trim().toLowerCase()) ||
    u.role?.toLowerCase().includes(search.trim().toLowerCase())
  );

  // -----------------------------
  // Confirmation Dialog Component
  // -----------------------------
  const ConfirmationDialog = () => {
    if (!showConfirm) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: 'black',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          maxWidth: '28rem',
          width: '100%',
          border: '1px solid #333'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>{confirmData.title}</h3>
          <p style={{ marginBottom: '1.5rem', color: '#e5e7eb' }}>{confirmData.message}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              onClick={handleCloseConfirm}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#333',
                borderRadius: '0.375rem',
                color: 'white',
                border: '1px solid #555',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                borderRadius: '0.375rem',
                color: 'white',
                border: '1px solid #ef4444',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="pt-24 px-6 relative">
      <ConfirmationDialog />
      <h1 className="text-3xl font-bold mb-6 text-white">
        All Registered Users
      </h1>

      <input
        type="text"
        placeholder="Search by name, email, or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md text-black rounded-md"
      />

      {message && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          borderRadius: '0.375rem',
          backgroundColor: message.includes('error') || message.includes('fail') ? '#fef2f2' : '#f0fdf4',
          color: message.includes('error') || message.includes('fail') ? '#dc2626' : '#15803d',
          border: `1px solid ${message.includes('error') || message.includes('fail') ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message}
        </div>
      )}
      {loading ? (
        <p style={{ color: 'white' }}>Loading users...</p>
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
                        onClick={() => showDeleteConfirmation(u.id, u.email)}
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
