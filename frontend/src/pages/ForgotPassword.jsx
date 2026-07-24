import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://employee-management-portal-2.onrender.com";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/auth/reset-password`, {
        email,
        password,
      });

      alert(res.data.message || "Password updated successfully");

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B4F8A] via-[#082C4C] to-[#16A5E8] px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-[#0B4F8A] text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#16A5E8]"
          />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#16A5E8]"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#16A5E8]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#16A5E8] hover:bg-[#0B4F8A] text-white rounded-xl font-bold transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-[#16A5E8] hover:text-[#0B4F8A] font-medium"
          >
            ← Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
}
