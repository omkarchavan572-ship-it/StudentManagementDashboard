import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Award, Settings, X, ShieldAlert } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Student Directory',
      path: '/students',
      icon: Users,
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between px-4 py-6 overflow-y-auto">
          <div className="space-y-6">
            
            {/* Mobile Header Close */}
            <div className="flex items-center justify-between lg:hidden pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Navigation Menu
              </span>
              <button
                onClick={closeSidebar}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Group */}
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Main Menu
              </p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeSidebar}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 dark:bg-brand-600'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats / Info Widget */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-1">
                <Award className="w-4 h-4" />
                <span>ScholarHub Academic v1.0</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Empowering administrators with real-time student insights, performance metrics, and course tracking.
              </p>
            </div>

          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MongoDB Memory/Primary Live</span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
