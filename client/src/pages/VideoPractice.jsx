import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  Eye,
  Send,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  Camera
} from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { videoAPI } from '../services/api';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const VideoPractice = () => {
  const levels = [
    { level: 1, name: 'Level 1: Voice Only', desc: 'Gentle start. No camera pressure. Focus purely on spoken clarity.' },
    { level: 2, name: 'Level 2: AI Avatar Interviewer', desc: 'Face-to-face practice with an animated virtual coach.' },
    { level: 3, name: 'Level 3: Presentation Simulation', desc: 'Present with an audience frame and slide deck overview.' },
    { level: 4, name: 'Level 4: Advanced Boardroom / Public Speaking', desc: 'High-stakes boardroom and conference hall pressure simulation.' },
  ];

  const scenarios = [
    {
      title: 'Job Interview',
      prompt: 'Tell me about a time you faced a difficult deadline and how you navigated it with your team.',
      instructions: 'You have 2 minutes. Maintain eye contact with the lens, speak at a measured pace, and summarize your solution.'
    },
    {
      title: 'Self Introduction',
      prompt: 'Introduce yourself to a room of 15 industry peers at an international networking mixer.',
      instructions: 'Share your background, current focus, and what kind of collaborations excite you.'
    },
    {
      title: 'College Presentation',
      prompt: 'Present your findings on the impact of renewable energy in developing economies.',
      instructions: 'Structure your opening, deliver 2 supporting points, and state your final recommendation.'
    },
    {
      title: 'Public Speaking',
      prompt: 'Deliver an inspiring 2-minute opening keynote on why failure is essential for breakthrough innovation.',
      instructions: 'Use vocal variety, pause for emphasis, and conclude with a memorable takeaway sentence.'
    },
    {
      title: 'Group Discussion',
      prompt: 'Interject respectfully into a heated debate about whether remote work reduces company loyalty.',
      instructions: 'Acknowledge the previous speaker’s point, introduce a balanced perspective, and invite others to comment.'
    },
    {
      title: 'Meeting',
      prompt: 'Brief senior leadership on a 3-week delay in the software delivery pipeline.',
      instructions: 'Be transparent about the blocker, explain the remediation plan, and project calm confidence.'
    },
    {
      title: 'Customer Complaint',
      prompt: 'Calmly resolve an upset client whose service was unexpectedly interrupted for 48 hours.',
      instructions: 'Acknowledge their frustration with empathy, apologize professionally, and outline immediate restitution.'
    },
    {
      title: 'Travel Conversation',
      prompt: 'Negotiate an emergency room change at a hotel due to noisy construction next door.',
      instructions: 'State your complaint clearly and politely request an upgrade or quiet alternative room.'
    },
    {
      title: 'Classroom Presentation',
      prompt: 'Explain the difference between weather and climate to a classroom of high school students.',
      instructions: 'Use relatable everyday analogies and speak clearly without excessive technical jargon.'
    }
  ];

  const [selectedLevel, setSelectedLevel] = useState(2);
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [isPracticing, setIsPracticing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const { videoRef, isActive: isCamActive, error: camError, startCamera, stopCamera } = useCamera();
  const {
    isRecording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
    resetAudio,
    permissionError: micError
  } = useAudioRecorder();

  const practiceTimerRef = useRef(null);

  // Initialize camera for level 2+
  useEffect(() => {
    if (selectedLevel > 1) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [selectedLevel]);

  // Handle Practice Start
  const handleStartPractice = async () => {
    setEvaluationResult(null);
    setElapsedSeconds(0);
    setIsPracticing(true);

    if (selectedLevel > 1 && !isCamActive) {
      await startCamera();
    }
    await startRecording();

    practiceTimerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Handle Practice Stop
  const handleStopPractice = () => {
    setIsPracticing(false);
    if (practiceTimerRef.current) clearInterval(practiceTimerRef.current);
    stopRecording();
  };

  // Handle Submit for AI evaluation
  const handleSubmitSession = async () => {
    handleStopPractice();

    if (!transcript || transcript.trim().length === 0) {
      alert('No spoken speech transcript detected. Please speak into your microphone before submitting.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await videoAPI.evaluate({
        scenario: selectedScenario.title,
        level: selectedLevel,
        transcript: transcript.trim(),
        duration: Math.max(15, elapsedSeconds)
      });

      if (res.data.success && res.data.session) {
        setEvaluationResult(res.data.session);
      }
    } catch (err) {
      console.error('Video evaluation error:', err);
      alert(err.response?.data?.message || 'Failed to evaluate video session.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    handleStopPractice();
    resetAudio();
    setEvaluationResult(null);
    setElapsedSeconds(0);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Video className="w-4 h-4" />
          <span>Overcome Stage Fear & Real-World Communication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Video Practice
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gently build presence, eye contact, and confidence through progressive video simulations.
        </p>
      </div>

      {/* Ethical Practice Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Communication Practice Note:</strong> SpeakWrite AI is designed to help you build confidence through regular, structured communication practice. It is not intended to treat, diagnose, or medically cure clinical anxiety disorders.
        </div>
      </div>

      {evaluationResult ? (
        /* Video Evaluation Result Card */
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-rose-50 border-2 border-rose-200 flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Video</span>
                <span className="text-3xl font-black text-rose-700">
                  {evaluationResult.scores?.overallScore || 74}
                </span>
                <span className="text-[10px] text-rose-500">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">Video Communication Report</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Level {evaluationResult.level} Evaluated
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Scenario: "{evaluationResult.scenario}"
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span>Duration: <strong>{evaluationResult.duration} seconds</strong></span>
                  <span>Pace: <strong>{evaluationResult.feedback?.paceWPM || 125} WPM</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Another Scenario
            </button>
          </div>

          {/* 6 Category Scores Breakdown (25/20/20/15/10/10) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Multimodal Evaluation Dimensions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Communication', weight: '25%', score: evaluationResult.scores?.communication || 75 },
                { label: 'Clarity', weight: '20%', score: evaluationResult.scores?.clarity || 72 },
                { label: 'Grammar', weight: '20%', score: evaluationResult.scores?.grammar || 70 },
                { label: 'Vocabulary', weight: '15%', score: evaluationResult.scores?.vocabulary || 68 },
                { label: 'Confidence', weight: '10%', score: evaluationResult.scores?.confidence || 65 },
                { label: 'Relevance', weight: '10%', score: evaluationResult.scores?.relevance || 80 },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                  <div className="text-xs font-semibold text-slate-500">{c.label}</div>
                  <div className="text-[10px] text-rose-600 font-medium">{c.weight}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {c.score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spoken Transcript Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Session Transcript
            </h4>
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
              "{evaluationResult.transcript}"
            </p>
          </div>

          {/* Stage Fear Advice & Body Language Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                Confidence & Stage Fear Tips
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(evaluationResult.feedback?.stageFearTips || [
                  'Keep eye contact near the upper third of your screen.',
                  'Shift your focus from your own nervous sensations to your listeners understanding.'
                ]).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-rose-600" />
                Presence & Body Language Advice
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(evaluationResult.feedback?.bodyLanguageAdvice || [
                  'Maintain an open chest posture with relaxed shoulders.',
                  'Use gentle, purposeful hand gestures to accentuate key conclusions.'
                ]).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Video Setup & Recording Screen */
        <div className="space-y-6">
          {/* Progressive Levels (1-4) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Progressive Exposure Level
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.level}
                  disabled={isPracticing}
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    selectedLevel === lvl.level
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block mb-1">{lvl.name}</span>
                    <p className="text-[11px] text-slate-500 leading-normal">{lvl.desc}</p>
                  </div>
                  {selectedLevel === lvl.level && (
                    <div className="mt-3 text-[10px] font-bold text-rose-600 uppercase">Selected Mode</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario & Instructions Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Scenario
              </h3>
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {scenarios.map((sc) => (
                  <button
                    key={sc.title}
                    disabled={isPracticing}
                    onClick={() => setSelectedScenario(sc)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedScenario.title === sc.title
                        ? 'bg-rose-50 text-rose-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 p-6 bg-slate-900 text-white rounded-3xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Simulation Prompt</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  "{selectedScenario.prompt}"
                </h3>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
                  <strong>Instructions:</strong> {selectedScenario.instructions}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Recommended practice time: 1.5 – 2 minutes</span>
                <span className="text-rose-300 font-semibold">Level {selectedLevel} Active</span>
              </div>
            </div>
          </div>

          {/* Video Arena & Recording Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="relative aspect-video max-w-2xl mx-auto rounded-3xl bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Level 1: Voice only placeholder */}
              {selectedLevel === 1 ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Mic className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-white">Level 1: Voice Only Mode</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Camera is disabled for this beginner level to keep pressure low.
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Subtle face centering guide overlay */}
                  <div className="absolute inset-0 border-2 border-white/10 pointer-events-none rounded-3xl flex items-center justify-center">
                    <div className="w-48 h-64 border-2 border-dashed border-white/25 rounded-full pointer-events-none" />
                  </div>
                </>
              )}

              {/* Status pill overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[11px] font-mono font-bold text-white">
                  <span className={`w-2 h-2 rounded-full ${isPracticing ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
                  <span>
                    {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
                    {String(elapsedSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Simulation Mode Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-200">
                  {selectedScenario.title}
                </span>
              </div>
            </div>

            {/* Error alerts */}
            {camError && selectedLevel > 1 && (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
                {camError}
              </div>
            )}
            {micError && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                {micError}
              </div>
            )}

            {/* Recording Controls: Start Practice, Stop, Submit */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {!isPracticing ? (
                <button
                  onClick={handleStartPractice}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start Practice
                </button>
              ) : (
                <button
                  onClick={handleStopPractice}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Stop
                </button>
              )}

              <button
                disabled={isEvaluating || !transcript || isPracticing}
                onClick={handleSubmitSession}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 disabled:opacity-50 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                {isEvaluating ? 'Evaluating Video...' : 'Submit Session'}
              </button>
            </div>

            {/* Transcript preview area */}
            {transcript && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Live Spoken Transcript:</span>
                <p>{transcript}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
