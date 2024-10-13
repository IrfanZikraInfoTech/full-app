import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem("auth-token", response.data.token);

      // Also store some user information (e.g., role) to check for authentication
      localStorage.setItem(
        "user",
        JSON.stringify({ role: response.data.role })
      );

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-500 to-yellow-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Admin Login
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 mb-4"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
