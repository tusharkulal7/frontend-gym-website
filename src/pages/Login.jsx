import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (storedUser && token) {
    onLogin(JSON.parse(storedUser), token);
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setLoading(false);
        if (res.status === 404) setMessage("User not found. Please sign up first.");
        else if (res.status === 400 || res.status === 401)
          setMessage(data.message || "Incorrect email or password.");
        else setMessage(data.message || "Server error. Please try again.");
        return;
      }

      const user = { name: data.name, email: data.email, role: data.role };

      // ✅ Save everything to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      onLogin(user, data.token);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setMessage("Server error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white font-bold text-xl">
        Logging in...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 text-lg rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 text-lg rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="p-3 text-lg bg-green-500 text-white rounded font-bold hover:bg-green-600 transition-colors"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-5 text-red-400 text-lg text-center">{message}</p>}
    </div>
  );
}
