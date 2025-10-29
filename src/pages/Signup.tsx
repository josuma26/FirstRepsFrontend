import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ATHLETE");
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validate fields
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      email: !email.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);

    // If any field is invalid, stop the signup process
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const data = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setUser(data.data);
      if (role === "COACH") {
        navigate("/dashboard");
      } else {
        navigate("/feed");
      }
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 text-yellow-900">
      <h1 className="text-4xl font-extrabold mb-6">Sign Up</h1>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={`mb-4 p-3 border ${
          errors.firstName ? "border-red-500" : "border-yellow-400"
        } rounded-lg w-80 focus:outline-none focus:ring-2 ${
          errors.firstName ? "focus:ring-red-500" : "focus:ring-yellow-500"
        }`}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className={`mb-4 p-3 border ${
          errors.lastName ? "border-red-500" : "border-yellow-400"
        } rounded-lg w-80 focus:outline-none focus:ring-2 ${
          errors.lastName ? "focus:ring-red-500" : "focus:ring-yellow-500"
        }`}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`mb-4 p-3 border ${
          errors.email ? "border-red-500" : "border-yellow-400"
        } rounded-lg w-80 focus:outline-none focus:ring-2 ${
          errors.email ? "focus:ring-red-500" : "focus:ring-yellow-500"
        }`}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`mb-4 p-3 border ${
          errors.password ? "border-red-500" : "border-yellow-400"
        } rounded-lg w-80 focus:outline-none focus:ring-2 ${
          errors.password ? "focus:ring-red-500" : "focus:ring-yellow-500"
        }`}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-6 p-3 border border-yellow-400 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <option value="ATHLETE">Athlete</option>
        <option value="COACH">Coach</option>
      </select>
      <button
        onClick={handleSignup}
        className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition mb-4"
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate("/login")}
        className="text-yellow-700 underline hover:text-yellow-900 transition"
      >
        Already have an account? Log in
      </button>
    </div>
  );
}