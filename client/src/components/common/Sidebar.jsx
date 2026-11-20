import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PenTool,
  Mic,
  MessagesSquare,
  Video,
  TrendingUp,
  History,
  User,
  LogOut,
  Sparkles,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/writing', label: 'Writing Practice', icon: PenTool, badge: 'Timed' },
    { to: '/voice', label: 'AI Voice Practice', icon: Mic },
    { to: '/conversation', label: 'AI Conversation', icon: MessagesSquare, badge: 'Interactive' },
    { to: '/video', label: 'AI Video Practice', icon: Video, badge: 'Confidence' },
    { to: '/progress', label: 'Progress & Scores', icon: TrendingUp },
    { to: '/history', label: 'Practice History', icon: History },
    { to: '/profile', label: 'Profile & Settings', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-calm-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                SpeakWrite <span className="text-brand-600">AI</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400 leading-none mt-0.5">
                Practice Privately. Speak Confidently.
              </p>
            </div>
          </div>

          {/* Quick Streak Card */}
          <div className="mt-5 p-3.5 bg-gradient-to-r from-brand-50 to-calm-50 border border-brand-100/60 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {user?.streak || 1} Day Streak
                </div>
                <div className="text-[10px] text-slate-500">
                  Goal: {user?.dailyGoal || 20}m/day
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-600 text-white rounded-full">
              {user?.englishLevel || 'Intermediate'}
            </span>
          </div>

          {/* Navigation links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & logout footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Learner'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
