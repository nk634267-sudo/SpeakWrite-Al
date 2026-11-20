import React from 'react';
import { Menu, Sparkles, Target, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = (user?.name || 'Learner').split(' ')[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
            {getGreeting()}, {firstName} <span className="animate-pulse">👋</span>
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            Today's goal: Practice for {user?.dailyGoal || 20} minutes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{user?.streak || 1} Day Streak</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Level: {user?.englishLevel || 'Intermediate'}</span>
        </div>
      </div>
    </header>
  );
};
