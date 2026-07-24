import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await login(email, password);

    setSubmitting(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const injectCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B4F8A] via-[#082C4C] to-[#16A5E8] px-4 relative overflow-hidden font-sans">

      <div className="absolute top-20 left-20 w-80 h-80 bg-[#0B4F8A]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#16A5E8]/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-8">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B4F8A] to-[#16A5E8] flex items-center justify-center mx-auto shadow-xl">

            <Briefcase className="w-8 h-8 text-white"/>

          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white">

            Employee Management System

          </h1>

        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {error && (

            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 text-red-600 px-4 py-3">

              <AlertCircle size={18}/>

              <span className="text-sm">{error}</span>

            </div>

          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>

              <label className="block text-sm font-semibold text-[#0B4F8A] mb-2">

                Email Address

              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#0B4F8A]" />

                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16A5E8] focus:border-[#16A5E8]"
                />

              </div>

            </div>

<div className="flex justify-end mt-2">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-sm text-[#16A5E8] hover:text-[#0B4F8A] hover:underline font-medium transition"
  >
    Forgot Password?
  </button>
</div>

<button
  type="submit"
  disabled={submitting}
  className="w-full py-3 bg-[#16A5E8] hover:bg-[#0B4F8A] disabled:opacity-60 text-white rounded-xl font-bold transition-all duration-300 shadow-lg"
>
  {submitting ? "Signing In..." : "Sign In"}
</button>

          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">

            <p className="text-center text-xs uppercase tracking-widest text-[#0B4F8A] font-bold mb-4">

              Quick Logins
              <br />
              <span className="font-normal text-gray-500">
                Password: password123
              </span>

            </p>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  injectCredentials(
                    'admin@portal.com',
                    'password123'
                  )
                }
                className="bg-[#EAF7FD] border border-[#16A5E8]/40 rounded-xl py-3 text-[#0B4F8A] font-semibold hover:bg-[#16A5E8] hover:text-white transition"
              >
                💼 Admin
              </button>

              <button
                type="button"
                onClick={() =>
                  injectCredentials(
                    'hr@portal.com',
                    'password123'
                  )
                }
                className="bg-[#EAF7FD] border border-[#16A5E8]/40 rounded-xl py-3 text-[#0B4F8A] font-semibold hover:bg-[#16A5E8] hover:text-white transition"
              >
                👥 HR
              </button>

              <button
                type="button"
                onClick={() =>
                  injectCredentials(
                    'manager@portal.com',
                    'password123'
                  )
                }
                className="bg-[#EAF7FD] border border-[#16A5E8]/40 rounded-xl py-3 text-[#0B4F8A] font-semibold hover:bg-[#16A5E8] hover:text-white transition"
              >
                👤 Manager
              </button>

              <button
                type="button"
                onClick={() =>
                  injectCredentials(
                    'employee@portal.com',
                    'password123'
                  )
                }
                className="bg-[#EAF7FD] border border-[#16A5E8]/40 rounded-xl py-3 text-[#0B4F8A] font-semibold hover:bg-[#16A5E8] hover:text-white transition"
              >
                ⚡ Employee
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
