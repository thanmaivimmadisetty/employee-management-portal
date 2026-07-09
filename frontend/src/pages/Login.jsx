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

  // If already authenticated, go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  // Helper function for quick credentials injection
  const injectCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* App Title Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-2xl shadow-brand-500/25 mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">
            Workforce Portal
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Access your Employee Management dashboard
          </p>
        </div>

        {/* Login Form Panel */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-brand-600/25 transition-all text-sm mt-2 flex items-center justify-center"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Helper Panel */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
              Quick Logins (password: password123)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => injectCredentials('admin@portal.com', 'password123')}
                className="py-2 px-3 bg-slate-800/40 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-left font-medium"
              >
                💼 <span className="font-bold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => injectCredentials('hr@portal.com', 'password123')}
                className="py-2 px-3 bg-slate-800/40 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-left font-medium"
              >
                👥 <span className="font-bold">HR</span>
              </button>
              <button
                type="button"
                onClick={() => injectCredentials('manager@portal.com', 'password123')}
                className="py-2 px-3 bg-slate-800/40 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-left font-medium"
              >
                👤 <span className="font-bold">Manager</span>
              </button>
              <button
                type="button"
                onClick={() => injectCredentials('employee@portal.com', 'password123')}
                className="py-2 px-3 bg-slate-800/40 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-left font-medium"
              >
                ⚡ <span className="font-bold">Employee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
