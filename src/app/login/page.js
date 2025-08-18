"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../../Api/AllApi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem("token", data.token);
      toast.success("Login Successful!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Sign in to access your dashboard
        </p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 transition"
            />
            <label
              className={`absolute left-5 top-4 text-gray-400 text-sm 
    ${
      email
        ? "top-[-8px] text-yellow-500 text-xs"
        : "peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm"
    } 
    transition-all`}
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 transition"
            />
            <label
              className={`absolute left-5 top-4 text-gray-400 text-sm 
    ${
      password
        ? "top-[-8px] text-yellow-500 text-xs"
        : "peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm"
    } 
    transition-all`}
            >
              Password
            </label>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Links */}
        <div className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
