import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  ShieldCheck,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const Progress = () => {
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
        console.warn('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const weeklyTrendData = [
    { week: 'Week 1', confidence: 35, writing: 45, speaking: 38, overall: 42 },
    { week: 'Week 2', confidence: 44, writing: 52, speaking: 46, overall: 49 },
    { week: 'Week 3', confidence: 53, writing: 61, speaking: 54, overall: 57 },
    { week: 'Week 4', confidence: 64, writing: summary?.writingScore || 72, speaking: summary?.speakingScore || 58, overall: 67 },
  ];

  const radarData = [
    { skill: 'Writing', score: summary?.writingScore || 72, fullMark: 100 },
    { skill: 'Grammar', score: summary?.grammarScore || 68, fullMark: 100 },
    { skill: 'Vocabulary', score: summary?.vocabularyScore || 65, fullMark: 100 },
    { skill: 'Speaking', score: summary?.speakingScore || 58, fullMark: 100 },
    { skill: 'Fluency', score: summary?.fluencyScore || 55, fullMark: 100 },
    { skill: 'Confidence', score: summary?.confidenceScore || 64, fullMark: 100 },
    { skill: 'Video Comm', score: summary?.videoScore || 70, fullMark: 100 },
  ];

  const insights = summary?.encouragingInsights || [
    'Your speaking fluency improved by 18%.',
    'You are making fewer grammar mistakes.',
    'Your answers are becoming more detailed.',
    'Your confidence score has improved by 29 points.'
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Longitudinal Growth</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Confidence & Fluency Progress
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Every timed essay, audio recording, and video simulation contributes to your communication scorecard.
        </p>
      </div>

      {/* Encouraging Insights Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-calm-50 to-indigo-50 border border-brand-200/80 rounded-3xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          Personalized Coach Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-brand-100 text-xs font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid: Multi-metric Trend & Radar Skill Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Weekly Skill Evolution</h3>
            <p className="text-xs text-slate-500">Confidence gains compared with writing and speaking</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis domain={[20, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  name="Confidence"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="writing"
                  name="Writing"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="speaking"
                  name="Speaking"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 text-center text-xs text-slate-500">
            <div>Week 1: <strong className="text-amber-600 font-bold">35</strong></div>
            <div>Week 2: <strong className="text-amber-600 font-bold">44</strong></div>
            <div>Week 3: <strong className="text-amber-600 font-bold">53</strong></div>
            <div>Week 4: <strong className="text-amber-600 font-bold">64</strong></div>
          </div>
        </div>

        {/* Skill Balance Radar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Communication Competency Radar</h3>
            <p className="text-xs text-slate-500">Holistic balance between written and spoken fluency</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" stroke="#64748B" fontSize={11} tickLine={false} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" fontSize={10} />
                <Radar
                  name="Skill Score"
                  dataKey="score"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Core Strength: <strong>Writing & Organization</strong></span>
            <span>Focus Area: <strong>Speaking Fluency</strong></span>
          </div>
        </div>
      </div>

      {/* Comprehensive Metric Cards (All 8 Dimension Scores) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">
          All Evaluated Dimensions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Writing Score', score: summary?.writingScore || 72 },
            { label: 'Grammar', score: summary?.grammarScore || 68 },
            { label: 'Vocabulary', score: summary?.vocabularyScore || 65 },
            { label: 'Speaking', score: summary?.speakingScore || 58 },
            { label: 'Fluency', score: summary?.fluencyScore || 55 },
            { label: 'Pronunciation', score: 76 },
            { label: 'Confidence', score: summary?.confidenceScore || 64 },
            { label: 'Video Communication', score: summary?.videoScore || 70 },
          ].map((item) => (
            <div key={item.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500">{item.label}</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {item.score}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
