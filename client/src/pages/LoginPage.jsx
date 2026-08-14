import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@edu.com');
    setPassword('admin123');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/60 to-blue-50/50 relative overflow-hidden font-sans select-none">
      
      {/* Soft Micro-Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Pastel Floating Gradient Orbs */}
      <div className="absolute top-1/6 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/6 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Clean White Glass Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300">
        
        {/* Top Gradient Bar Accent */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-2/3 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-full" />

        {/* Brand Logo & Title Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/25 mb-4 group cursor-pointer">
            <GraduationCap className="w-9 h-9 transform group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-semibold tracking-wide mb-2">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Administrative Portal
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Scholar<span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Student Management & Institutional Analytics
          </p>
        </div>

        {/* Clean Quick-Fill Demo Credentials Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">Demo Admin Access</p>
              <p className="text-[11px] font-mono text-slate-500">admin@edu.com / admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3.5 py-1.5 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edu.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium border ${
                  errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium border ${
                  errors.password ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all transform active:scale-[0.99] tracking-wide"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

        </form>

        {/* Security Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Session & JWT Token Protection</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
