import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-brand-950/50">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg text-white shadow-lg shadow-brand-500/30 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Edu<span className="text-brand-400">Pulse</span> Portal
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Mini Student Management & Academic Dashboard
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-brand-950/40 border border-brand-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-brand-200">Demo Admin Login</p>
              <p className="text-[11px] text-slate-400">admin@edu.com / admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-1 text-[11px] font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-xs"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edu.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                  errors.email ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                  errors.password ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white gradient-bg hover:opacity-95 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Security Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Protected by Encrypted JWT & Session Token Security
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
