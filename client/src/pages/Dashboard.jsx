import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool,
  Mic,
  Video,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressAPI.getSummary();
        if (res.data.success) {
          setSummary(res.data.summary);
        }
      } catch (err) {
        console.warn('Failed to load progress summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = (user?.name || 'Learner').split(' ')[0];

  // Default values matching prompt specifications
  const writingScore = summary?.writingScore ?? 72;
  const grammarScore = summary?.grammarScore ?? 68;
  const vocabularyScore = summary?.vocabularyScore ?? 65;
  const speakingScore = summary?.speakingScore ?? 58;
  const fluencyScore = summary?.fluencyScore ?? 55;
  const confidenceScore = summary?.confidenceScore ?? 50;

  const chartData = summary?.weeklyChart || [
    { week: 'Week 1', score: 42 },
    { week: 'Week 2', failure: 0, score: 49 },
    { week: 'Week 3', score: 57 },
    { week: 'Week 4', score: 67 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner & Today's Goal */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-calm-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-calm-400" />
              <span>Safe Practice Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              "Practice privately. Make mistakes safely. Speak confidently."
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[220px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-calm-300 mb-1">
              <Clock className="w-4 h-4" />
              <span>Today's Goal</span>
            </div>
            <div className="text-xl font-black text-white">
              Practice for {user?.dailyGoal || 20} minutes
            </div>
            <div className="mt-2 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-calm-400 rounded-full" style={{ width: '45%' }} />
            </div>
            <span className="text-[11px] text-slate-300 mt-1 block">
              9 of {user?.dailyGoal || 20} mins completed today
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Practice Actions</h2>
          <span className="text-xs text-slate-500 font-medium">Choose your mode for today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Writing Practice Card */}
          <Link
            to="/writing"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-300 transition-all hover:translate-y-[-2px] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                Writing Practice
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Timed essay, journal, and email writing. AI analyzes grammar, clarity, and vocabulary in depth.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Start 5–15 min session</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]">Instant Feedback</span>
            </div>
          </Link>

          {/* Voice Practice Card */}
          <Link
            to="/voice"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-300 transition-all hover:translate-y-[-2px] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                Voice Practice
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live speech-to-text recording with waveform visualizer. Measures fluency, pronunciation, and fillers.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Start microphone test</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px]">Speech-to-Text</span>
            </div>
          </Link>

          {/* Video Practice Card */}
          <Link
            to="/video"
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-300 transition-all hover:translate-y-[-2px] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                Video Practice
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Overcome stage fear with progressive camera simulations: Job interviews, presentations, and group talks.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Simulate interview</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px]">Stage Fear Training</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Progress Scores Section (6 Key Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Skill Competency Scores</h2>
          <Link to="/progress" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'Writing', score: writingScore, color: 'text-blue-600' },
            { label: 'Grammar', score: grammarScore, color: 'text-indigo-600' },
            { label: 'Vocabulary', score: vocabularyScore, color: 'text-purple-600' },
            { label: 'Speaking', score: speakingScore, color: 'text-teal-600' },
            { label: 'Fluency', score: fluencyScore, color: 'text-emerald-600' },
            { label: 'Confidence', score: confidenceScore, color: 'text-amber-600' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center"
            >
              <span className="text-xs font-semibold text-slate-500 mb-1">{item.label}</span>
              <div className="text-2xl font-black text-slate-900">
                {item.score}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary & Improvement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Stats Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              Practice Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-slate-600">Current Streak</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {summary?.currentStreak ?? user?.streak ?? 1} Days
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium text-slate-600">Total Practice Time</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {summary?.totalPracticeTime ?? (user?.totalPracticeTime || 45)} mins
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-600">Total Sessions</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {summary?.totalSessions ?? 8} sessions
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-medium text-slate-600">Topics Completed</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {summary?.topicsCompleted ?? 6} topics
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold text-emerald-800">
              {summary?.improvementMessage || 'Your communication score improved by 25 points.'}
            </span>
          </div>
        </div>

        {/* Improvement Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Communication Score Trajectory</h3>
              <p className="text-xs text-slate-500">Weekly progression across written & spoken drills</p>
            </div>
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-brand-100">
              +25 Pts Overall
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Week 1 → 42</span>
            <span>Week 2 → 49</span>
            <span>Week 3 → 57</span>
            <span className="font-bold text-brand-600">Week 4 → 67</span>
          </div>
        </div>
      </div>
    </div>
  );
};
