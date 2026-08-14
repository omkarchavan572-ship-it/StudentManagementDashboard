import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, KeyRound, Eye, EyeOff, Terminal, Cpu } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#070b14] relative overflow-hidden font-sans select-none">
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Cyber Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all duration-300">
        
        {/* Glowing Top Bar Accent */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]" />

        {/* Brand Logo & Title Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.4)] mb-4 group cursor-pointer">
            <GraduationCap className="w-9 h-9 transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-md pointer-events-none" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Cpu className="w-3 h-3 text-cyan-400" /> SYSTEM ONLINE
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white mt-2">
            Edu<span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Pulse</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Academic Management & Student Intelligence Portal
          </p>
        </div>

        {/* HUD Quick-Fill Demo Credentials */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-teal-950/60 border border-cyan-800/40 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-900/50 text-cyan-400 border border-cyan-700/50">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <p className="text-xs font-bold text-cyan-200 tracking-wide">Demo Admin Access</p>
              </div>
              <p className="text-[11px] font-mono text-slate-400">admin@edu.com / admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3.5 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-200" /> Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cyan-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edu.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-950/80 text-cyan-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all font-mono border ${
                  errors.email ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cyan-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-950/80 text-cyan-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all font-mono border ${
                  errors.password ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'border-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:via-teal-300 hover:to-emerald-300 shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] disabled:opacity-50 transition-all transform active:scale-[0.99] tracking-wider uppercase"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating System...</span>
              </div>
            ) : (
              <>
                <span>Launch Control Center</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>

        </form>

        {/* Terminal / Security Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-BIT ENCRYPTED • SESSION AUTH ACTIVE</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
