import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          email,
          otp,
          password,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0B4F8A] via-[#082C4C] to-[#16A5E8]">

      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-3xl shadow-xl w-[420px]"
      >

        <h2 className="text-3xl font-bold text-center mb-6 text-[#0B4F8A]">
          Reset Password
        </h2>

        <div className="relative mb-5">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 pr-12"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>

        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full border rounded-xl p-3 mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#16A5E8] hover:bg-[#0B4F8A] text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;
