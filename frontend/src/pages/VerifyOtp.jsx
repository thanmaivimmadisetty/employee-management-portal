import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email,
          otp,
        }
      );

      alert(res.data.message);

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Invalid or expired OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0B4F8A] via-[#082C4C] to-[#16A5E8]">

      <form
        onSubmit={verifyOtp}
        className="bg-white p-8 rounded-3xl shadow-xl w-[400px]"
      >

        <h2 className="text-3xl font-bold text-center mb-6 text-[#0B4F8A]">
          Verify OTP
        </h2>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-xl p-3 mb-5"
          required
        />

        <button
          className="w-full bg-[#16A5E8] hover:bg-[#0B4F8A] text-white py-3 rounded-xl font-bold"
        >
          Verify OTP
        </button>

      </form>

    </div>
  );
};

export default VerifyOtp;
