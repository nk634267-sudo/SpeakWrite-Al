import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Target,
  Clock,
  Flame,
  Award,
  Settings,
  Bell,
  Volume2,
  Check,
  Save,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, progressAPI } from '../services/api';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [englishLevel, setEnglishLevel] = useState(user?.englishLevel || 'Intermediate');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 20);
  const [voiceAccent, setVoiceAccent] = useState(user?.settings?.voiceAccent || 'alloy');
  const [speechRate, setSpeechRate] = useState(user?.settings?.speechRate || 1.0);
  const [notifications, setNotifications] = useState(user?.settings?.notificationsEnabled ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEnglishLevel(user.englishLevel || 'Intermediate');
      setDailyGoal(user.dailyGoal || 20);
      if (user.settings) {
        setVoiceAccent(user.settings.voiceAccent || 'alloy');
        setSpeechRate(user.settings.speechRate || 1.0);
        setNotifications(user.settings.notificationsEnabled ?? true);
      }
    }

    const fetchSummary = async () => {
      try {
        const res = await progressAPI.getSummary();
        if (res.data.success) {
          setSummary(res.data.summary);
        }
      } catch (err) {
        console.warn('Failed to load summary in profile:', err);
      }
    };
    fetchSummary();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const res = await updateProfile({
        name,
        englishLevel,
        dailyGoal: Number(dailyGoal),
        settings: {
          voiceAccent,
          speechRate: Number(speechRate),
          notificationsEnabled: notifications
        }
      });

      if (res.success) {
        setSaveSuccessMsg('Profile and preferences updated successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Learner Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Account & Practice Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your English learning target, daily practice commitment, and AI voice preferences.
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Streak</div>
            <div className="text-lg font-black text-slate-900">{user?.streak || 1} Days</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Total Practice</div>
            <div className="text-lg font-black text-slate-900">{user?.totalPracticeTime || 45} mins</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Level</div>
            <div className="text-lg font-black text-slate-900">{englishLevel}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Overall Score</div>
            <div className="text-lg font-black text-slate-900">{summary?.writingScore || 72}/100</div>
          </div>
        </div>
      </div>

      {/* Profile & Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                English Proficiency Level
              </label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Practice Goal
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value={10}>10 minutes / day</option>
                <option value={20}>20 minutes / day (Recommended)</option>
                <option value={30}>30 minutes / day</option>
                <option value={45}>45 minutes / day</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Voice & Assistant Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            AI Voice & Audio Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                AI Voice Persona
              </label>
              <select
                value={voiceAccent}
                onChange={(e) => setVoiceAccent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="alloy">Alloy (Warm & Balanced)</option>
                <option value="echo">Echo (Crisp & Articulate)</option>
                <option value="fable">Fable (Expressive British)</option>
                <option value="onyx">Onyx (Deep & Authoritative)</option>
                <option value="nova">Nova (Energetic & Friendly)</option>
                <option value="shimmer">Shimmer (Calm & Clear)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                AI Speech Pace ({speechRate}x)
              </label>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(e.target.value)}
                className="w-full mt-2 accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.75x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.25x (Faster)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Daily Practice Reminders</span>
              <span className="text-xs text-slate-500">Receive supportive notifications to maintain your daily streak</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 disabled:opacity-50 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
