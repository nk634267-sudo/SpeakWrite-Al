import React, { useState, useEffect, useRef } from 'react';
import {
  PenTool,
  Clock,
  Play,
  Pause,
  Send,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { writingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../hooks/useTimer';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { MistakeHighlight } from '../components/common/MistakeHighlight';

export const Writing = () => {
  const { user } = useAuth();

  // Setup options state
  const [category, setCategory] = useState('Essay');
  const [difficulty, setDifficulty] = useState(user?.englishLevel || 'Intermediate');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [wordTarget, setWordTarget] = useState(100);
  const [isCustomWordTarget, setIsCustomWordTarget] = useState(false);

  // Practice state
  const [topic, setTopic] = useState('Should college students be allowed to use mobile phones during lectures?');
  const [tips, setTips] = useState(['State your stance clearly in the opening.', 'Provide at least two distinct reasons.']);
  const [answer, setAnswer] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingTopic, setGeneratingTopic] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [draftSavedMsg, setDraftSavedMsg] = useState('');

  const answerRef = useRef(answer);
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  // Handle auto-submit on timer expiry
  const handleAutoSubmit = () => {
    console.log('Timer reached zero! Automatically submitting writing answer...');
    submitWritingAction(true);
  };

  const timer = useTimer(timeLimitMinutes * 60, handleAutoSubmit);

  // Update timer whenever user changes time limit minutes before starting
  const handleTimeChange = (mins) => {
    setTimeLimitMinutes(mins);
    timer.reset(mins * 60);
  };

  // Generate new topic from backend
  const handleGenerateTopic = async () => {
    setGeneratingTopic(true);
    try {
      const res = await writingAPI.getTopic(category, difficulty);
      if (res.data.success && res.data.topic) {
        setTopic(res.data.topic);
        if (res.data.tips) setTips(res.data.tips);
      }
    } catch (err) {
      console.warn('Using default topic:', err);
    } finally {
      setGeneratingTopic(false);
    }
  };

  // Start practicing
  const handleStart = () => {
    setHasStarted(true);
    timer.start();
  };

  // Word count helper
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Submit writing
  const submitWritingAction = async (isAuto = false) => {
    const currentText = answerRef.current;
    if (!currentText || currentText.trim().length === 0) {
      alert('Please write something before submitting.');
      return;
    }

    timer.pause();
    setIsSubmitting(true);

    try {
      const timeUsedSeconds = (timeLimitMinutes * 60) - timer.timeLeft;
      const res = await writingAPI.submitWriting({
        topic,
        category,
        difficulty,
        timeLimit: timeLimitMinutes * 60,
        timeUsed: Math.max(10, timeUsedSeconds),
        answer: currentText
      });

      if (res.data.success) {
        setSubmissionResult(res.data.submission);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('speakwrite_writing_draft', JSON.stringify({ topic, answer, date: new Date().toISOString() }));
    setDraftSavedMsg('Draft saved locally!');
    setTimeout(() => setDraftSavedMsg(''), 3000);
  };

  const resetToNewSession = () => {
    setSubmissionResult(null);
    setAnswer('');
    setHasStarted(false);
    timer.reset(timeLimitMinutes * 60);
    handleGenerateTopic();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <PenTool className="w-4 h-4" />
          <span>Deliberate Practice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Timed Writing Practice
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Write within a time limit to overcome overthinking. When time expires, AI analyzes grammar, structure, and lexical range.
        </p>
      </div>

      {/* If submission result is available, show AI Feedback View */}
      {submissionResult ? (
        <div className="space-y-8 animate-fade-in">
          {/* Top Score Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-brand-50 border-2 border-brand-200 flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Overall</span>
                <span className="text-3xl font-black text-brand-700">
                  {submissionResult.score}
                </span>
                <span className="text-[10px] text-brand-500">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">AI Writing Diagnostic</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Evaluated
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Topic: "{submissionResult.topic}"
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span>Words: <strong>{submissionResult.wordCount}</strong></span>
                  <span>Time used: <strong>{Math.round(submissionResult.timeUsed / 60)} mins</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={resetToNewSession}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Another Topic
            </button>
          </div>

          {/* Category Score Cards (Strict 6 Weighted Breakdown) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Weighted Category Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Grammar', weight: '25%', score: submissionResult.scores?.grammar || submissionResult.feedback?.grammar || 70 },
                { label: 'Vocabulary', weight: '20%', score: submissionResult.scores?.vocabulary || submissionResult.feedback?.vocabulary || 68 },
                { label: 'Structure', weight: '20%', score: submissionResult.scores?.sentenceStructure || submissionResult.feedback?.sentenceStructure || 75 },
                { label: 'Clarity', weight: '15%', score: submissionResult.scores?.clarity || submissionResult.feedback?.clarity || 72 },
                { label: 'Organization', weight: '10%', score: submissionResult.scores?.organization || submissionResult.feedback?.organization || 76 },
                { label: 'Spelling', weight: '10%', score: submissionResult.scores?.spelling || submissionResult.feedback?.spelling || 80 },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                  <div className="text-xs font-semibold text-slate-500">{c.label}</div>
                  <div className="text-[10px] text-brand-600 font-medium">{c.weight}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {c.score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In-Text Highlight with Clickable Annotations */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                Original Submission with Highlighted Corrections
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Click any highlighted error to review the grammar explanation
              </span>
            </div>
            <MistakeHighlight
              text={submissionResult.answer}
              mistakes={submissionResult.feedback?.mistakes || []}
            />
          </div>

          {/* Detailed Mistakes Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Detailed Mistakes & Pedagogical Explanations
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full">
                {(submissionResult.feedback?.mistakes || []).length} Detected
              </span>
            </div>

            {(!submissionResult.feedback?.mistakes || submissionResult.feedback.mistakes.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                🎉 Impressive! No major structural or grammatical mistakes were detected in this submission.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4 pl-6">Original</th>
                      <th className="p-4">Correction</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 pr-6">Why It's Incorrect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissionResult.feedback.mistakes.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 pl-6 font-medium text-rose-700 bg-rose-50/30">
                          <span className="line-through">"{m.original}"</span>
                        </td>
                        <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">
                          "{m.correction}"
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {m.category || 'Grammar'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-slate-600 text-xs leading-relaxed">
                          {m.explanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Things You Did Well
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(submissionResult.feedback?.strengths || ['Clear thesis statement maintained throughout.', 'Natural sentence rhythm.']).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Things to Improve
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(submissionResult.feedback?.weaknesses || ['Watch for subject-verb agreement.', 'Incorporate complex transitions.']).map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Better Vocabulary Suggestions */}
          {submissionResult.feedback?.vocabularySuggestions && submissionResult.feedback.vocabularySuggestions.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                Better Vocabulary Suggestions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submissionResult.feedback.vocabularySuggestions.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 font-medium">Instead of: <strong className="text-slate-700">"{v.original}"</strong></span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-md">
                        {v.suggestion}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{v.explanation}</p>
                    {v.example && (
                      <p className="text-xs italic text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                        Example: "{v.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Recommendations */}
          {submissionResult.feedback?.practiceRecommendations && (
            <div className="p-6 bg-gradient-to-r from-brand-50 to-calm-50 border border-brand-200 rounded-3xl space-y-2">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                Practice Recommendations For Tomorrow
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {submissionResult.feedback.practiceRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Writing Practice Active / Config Mode */
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  disabled={hasStarted}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {[
                    'Essay',
                    'Paragraph',
                    'Story',
                    'Email',
                    'Letter',
                    'Opinion',
                    'Interview Answer',
                    'Daily Journal',
                    'Presentation Topic'
                  ].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <select
                  disabled={hasStarted}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Time Limit
                </label>
                <select
                  disabled={hasStarted}
                  value={timeLimitMinutes}
                  onChange={(e) => handleTimeChange(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value={1}>1 minute (Quick Test)</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              {/* Word Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Word Target
                </label>
                <select
                  disabled={hasStarted}
                  value={isCustomWordTarget ? 'custom' : wordTarget}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomWordTarget(true);
                    } else {
                      setIsCustomWordTarget(false);
                      setWordTarget(Number(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value={50}>50 words</option>
                  <option value={100}>100 words</option>
                  <option value={200}>200 words</option>
                  <option value={300}>300 words</option>
                  <option value="custom">Custom target...</option>
                </select>
              </div>
            </div>

            {isCustomWordTarget && !hasStarted && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-600 font-medium">Custom Word Target:</span>
                <input
                  type="number"
                  min={20}
                  max={1000}
                  value={wordTarget}
                  onChange={(e) => setWordTarget(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            )}
          </div>

          {/* Topic Banner with AI Generate Button */}
          <div className="p-6 bg-brand-900 text-white rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-calm-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Generated Topic</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                "{topic}"
              </h2>
              {tips && tips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tips.map((tip, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                      💡 {tip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!hasStarted && (
              <button
                onClick={handleGenerateTopic}
                disabled={generatingTopic}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {generatingTopic ? 'Generating...' : 'New Topic'}
              </button>
            )}
          </div>

          {/* Practice Control Bar & Timer */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Countdown Timer Display */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-lg ${
                timer.timeLeft < 60 && timer.isRunning
                  ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                <Clock className="w-5 h-5 mr-1" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Time Remaining</div>
                <div className="text-2xl font-black font-mono text-slate-900">
                  {timer.formatTime()}
                </div>
              </div>
            </div>

            {/* Word Count & Target Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Word Count</div>
                <div className="text-xl font-bold text-slate-900">
                  {wordCount} <span className="text-xs text-slate-400 font-normal">/ {wordTarget} target</span>
                </div>
              </div>
              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (wordCount / wordTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Action Buttons: Start, Pause, Submit, Save Draft */}
            <div className="flex items-center gap-2">
              {!hasStarted ? (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start Timer
                </button>
              ) : (
                <>
                  {timer.isPaused ? (
                    <button
                      onClick={timer.resume}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Resume
                    </button>
                  ) : (
                    <button
                      onClick={timer.pause}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </button>
                  )}

                  <button
                    onClick={handleSaveDraft}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Draft
                  </button>

                  <button
                    disabled={isSubmitting || wordCount === 0}
                    onClick={() => submitWritingAction(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                </>
              )}
            </div>
          </div>

          {draftSavedMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 animate-fade-in">
              {draftSavedMsg}
            </div>
          )}

          {/* Writing Area */}
          <div className="relative">
            <textarea
              rows={12}
              value={answer}
              disabled={timer.hasExpired || (!hasStarted && false)}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={hasStarted ? "Start typing your response here... Express your thoughts freely without over-analyzing." : "Click 'Start Timer' above to begin your timed writing practice..."}
              className={`w-full p-6 rounded-3xl border text-base font-normal leading-relaxed focus:outline-none transition-all ${
                timer.hasExpired
                  ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-white border-slate-200 focus:ring-2 focus:ring-brand-500 shadow-xs'
              }`}
            />

            {timer.hasExpired && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
                <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm">
                  <Clock className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-900">Time's Up!</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Your session ended. Click submit below to generate your complete AI analysis.
                  </p>
                  <button
                    onClick={() => submitWritingAction(true)}
                    className="w-full py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-brand-700"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
