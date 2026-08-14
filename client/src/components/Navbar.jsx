import React from 'react';
import { Sun, Moon, LogOut, GraduationCap, Menu, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Scholar<span className="text-brand-600 dark:text-brand-400">Hub</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800">
                SaaS Admin
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Theme Toggle & User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* Admin User Info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white dark:bg-brand-600 flex items-center justify-center font-bold text-xs shadow">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 rounded-xl transition-all border border-rose-200/50 dark:border-rose-900/50"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
