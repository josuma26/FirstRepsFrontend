import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data);
      if (res.data.role === "COACH") {
        navigate("/dashboard");
      } else {
        navigate("/feed");
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 text-yellow-900">
      <h1 className="text-4xl font-extrabold mb-6">Log In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 border border-yellow-400 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 p-3 border border-yellow-400 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        onClick={handleLogin}
        className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition mb-4"
      >
        Log In
      </button>
      <button
        onClick={() => navigate("/signup")}
        className="text-yellow-700 underline hover:text-yellow-900 transition"
      >
        Don't have an account? Sign up
      </button>
    </div>
  );
}