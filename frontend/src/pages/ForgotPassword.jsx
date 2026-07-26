import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );

      alert(res.data.message);

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0B4F8A] via-[#082C4C] to-[#16A5E8]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-[400px]"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#0B4F8A]">
          Forgot Password
        </h2>

        <div className="relative mb-6">
          <Mail className="absolute left-3 top-3.5 text-[#0B4F8A]" />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 py-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#16A5E8] hover:bg-[#0B4F8A] text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
