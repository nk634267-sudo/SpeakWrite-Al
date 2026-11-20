import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  PenTool,
  Mic,
  Video,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { writingAPI, voiceAPI, videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const History = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Writing', 'Voice', 'Video'
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchAllHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const userId = user.id || user._id;
        const [wRes, vRes, vidRes] = await Promise.allSettled([
          writingAPI.getHistory(userId),
          voiceAPI.getHistory(userId),
          videoAPI.getHistory(userId)
        ]);

        const all = [];
        if (wRes.status === 'fulfilled' && wRes.value.data.success) {
          (wRes.value.data.history || []).forEach((w) => {
            all.push({
              id: w._id || w.id,
              type: 'Writing',
              topic: w.topic,
              score: w.score,
              duration: w.timeUsed ? `${Math.round(w.timeUsed / 60)}m` : '5m',
              date: w.createdAt,
              details: w
            });
          });
        }

        if (vRes.status === 'fulfilled' && vRes.value.data.success) {
          (vRes.value.data.history || []).forEach((v) => {
            all.push({
              id: v._id || v.id,
              type: 'Voice',
              topic: v.scenario,
              score: v.scores?.overallScore || 70,
              duration: `${v.duration || 30}s`,
              date: v.createdAt,
              details: v
            });
          });
        }

        if (vidRes.status === 'fulfilled' && vidRes.value.data.success) {
          (vidRes.value.data.history || []).forEach((vd) => {
            all.push({
              id: vd._id || vd.id,
              type: 'Video',
              topic: vd.scenario,
              score: vd.scores?.overallScore || 72,
              duration: `${vd.duration || 45}s`,
              date: vd.createdAt,
              details: vd
            });
          });
        }

        // Sort descending by date
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSessions(all);
      } catch (err) {
        console.warn('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHistory();
  }, [user]);

  const filteredSessions = sessions.filter((s) => {
    if (activeTab !== 'All' && s.type !== activeTab) return false;
    if (s.score < minScoreFilter) return false;
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Writing': return <PenTool className="w-4 h-4 text-blue-600" />;
      case 'Voice': return <Mic className="w-4 h-4 text-indigo-600" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <HistoryIcon className="w-4 h-4" />
          <span>Practice Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Practice History & Diagnostics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review previous writing submissions, voice recordings, and video simulations to track your personal trajectory.
        </p>
      </div>

      {/* Filter Tabs & Score Slider */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
          {['All', 'Writing', 'Voice', 'Video'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Min Score Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">Min Score:</span>
          <select
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value={0}>All Scores</option>
            <option value={60}>60+ Points</option>
            <option value={70}>70+ Points</option>
            <option value={80}>80+ Points</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading your practice history...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <HistoryIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No practice sessions found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start a timed writing exercise or voice practice session to see detailed records here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSession(s)}
                className="p-5 sm:px-6 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getTypeIcon(s.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {s.topic}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{new Date(s.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Duration: {s.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <ScoreBadge score={s.score} size="md" />
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Session Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {selectedSession.type} Practice Record
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  "{selectedSession.topic}"
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Recorded on {new Date(selectedSession.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Dimensions */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-medium">Evaluation Score</div>
                <div className="text-2xl font-black text-slate-900">{selectedSession.score}/100</div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Duration: <strong>{selectedSession.duration}</strong></div>
              </div>
            </div>

            {/* Submission / Transcript Text */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                User Submission / Transcript
              </h4>
              <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedSession.details?.answer || selectedSession.details?.transcript || 'No transcript recorded.'}
              </p>
            </div>

            {/* Detailed mistakes if writing */}
            {selectedSession.type === 'Writing' && selectedSession.details?.feedback?.mistakes && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detected Mistakes & Corrections
                </h4>
                <div className="space-y-2">
                  {selectedSession.details.feedback.mistakes.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-rose-800 line-through">"{m.original}"</span>
                        <span>→</span>
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">"{m.correction}"</span>
                      </div>
                      <p className="text-slate-600">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
