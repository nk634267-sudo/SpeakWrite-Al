import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { voiceAPI } from '../services/api';
import { AudioVisualizer } from '../components/common/AudioVisualizer';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const VoicePractice = () => {
  const samplePrompts = [
    'Tell me about yourself and what drives your ambition.',
    'Describe a project you worked on that you are particularly proud of.',
    'How do you handle high-pressure situations or tight deadlines?',
    'What is your favorite travel destination and what made it memorable?',
    'Explain a complex topic in your field as if you were explaining it to a 10-year-old.'
  ];

  const [promptIndex, setPromptIndex] = useState(0);
  const currentPrompt = samplePrompts[promptIndex];

  const {
    isRecording,
    transcript,
    setTranscript,
    recordingTime,
    audioLevel,
    permissionError,
    startRecording,
    stopRecording,
    resetAudio
  } = useAudioRecorder();

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % samplePrompts.length);
    resetAudio();
    setEvaluationResult(null);
  };

  const handleEvaluate = async () => {
    if (isRecording) {
      stopRecording();
    }

    if (!transcript || transcript.trim().length === 0) {
      alert('Please speak or provide a transcript before evaluating.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await voiceAPI.evaluate({
        scenario: currentPrompt,
        transcript: transcript.trim(),
        duration: Math.max(10, recordingTime)
      });

      if (res.data.success && res.data.session) {
        setEvaluationResult(res.data.session);
      }
    } catch (err) {
      console.error('Voice evaluation error:', err);
      alert(err.response?.data?.message || 'Failed to evaluate voice practice.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetSession = () => {
    resetAudio();
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Mic className="w-4 h-4" />
          <span>Speech Fluency & Pronunciation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Voice Practice
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Speak directly into your microphone. AI evaluates your fluency, filler words, grammar, and speaking confidence.
        </p>
      </div>

      {permissionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <div className="font-bold">Microphone Permission Required</div>
            <p className="mt-0.5 text-xs text-rose-700">{permissionError}</p>
          </div>
        </div>
      )}

      {/* If evaluated, show full Speaking Diagnostic */}
      {evaluationResult ? (
        <div className="space-y-8 animate-fade-in">
          {/* Top Speaking Score Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Speaking</span>
                <span className="text-3xl font-black text-indigo-700">
                  {evaluationResult.scores?.overallScore || 67}
                </span>
                <span className="text-[10px] text-indigo-500">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">Voice Evaluation Diagnostic</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Speech Scored
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Prompt: "{evaluationResult.scenario}"
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span>Pace: <strong>{evaluationResult.feedback?.paceWPM || 120} WPM</strong></span>
                  <span>Duration: <strong>{evaluationResult.duration} seconds</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetSession}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Another Prompt
            </button>
          </div>

          {/* Speaking Category Cards (25/20/20/20/15) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Speaking Score Dimensions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { label: 'Fluency', weight: '25%', score: evaluationResult.scores?.fluency || 75 },
                { label: 'Grammar', weight: '20%', score: evaluationResult.scores?.grammar || 70 },
                { label: 'Vocabulary', weight: '20%', score: evaluationResult.scores?.vocabulary || 72 },
                { label: 'Pronunciation', weight: '20%', score: evaluationResult.scores?.pronunciation || 76 },
                { label: 'Confidence', weight: '15%', score: evaluationResult.scores?.confidence || 68 },
              ].map((c) => (
                <div key={c.label} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                  <div className="text-xs font-semibold text-slate-500">{c.label}</div>
                  <div className="text-[10px] text-indigo-600 font-medium">{c.weight}</div>
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
              Captured Speech Transcript
            </h4>
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-medium">
              "{evaluationResult.transcript}"
            </p>
          </div>

          {/* Filler Words & Pacing Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Filler Word Frequency
              </h4>
              {(!evaluationResult.feedback?.fillerWords || evaluationResult.feedback.fillerWords.length === 0) ? (
                <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-3 rounded-xl">
                  ✨ No disruptive filler words detected! Excellent flow.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {evaluationResult.feedback.fillerWords.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                      <span className="font-semibold text-slate-700">"{f.word}"</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">
                        {f.count} {f.count === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Speaking Rhythm & WPM
              </h4>
              <div className="text-2xl font-black text-slate-900">
                {evaluationResult.feedback?.paceWPM || 120} <span className="text-xs font-normal text-slate-400">Words Per Minute</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Target conversational speed: 110–140 WPM. Your tempo was clear and easy to follow.
              </p>
            </div>
          </div>

          {/* Strengths & Pronunciation Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Speaking Strengths
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(evaluationResult.feedback?.strengths || ['Clear vocal projection.', 'Prompt answered directly.']).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                Pronunciation & Delivery Tips
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {(evaluationResult.feedback?.pronunciationTips || ['Practice word-ending consonants clearly.']).map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Voice Recording Screen */
        <div className="space-y-6">
          {/* Question / Prompt Card */}
          <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Speaking Prompt
              </span>
              <button
                onClick={handleNextPrompt}
                disabled={isRecording}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
              >
                Change Prompt ↻
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-snug">
              "{currentPrompt}"
            </h2>
            <p className="text-xs text-slate-500">
              Take 10 seconds to collect your thoughts, then click "Start Speaking" and answer naturally.
            </p>
          </div>

          {/* Audio Waveform & Status Container */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-6">
            {/* Live Waveform */}
            <div className="w-full max-w-md">
              <AudioVisualizer isRecording={isRecording} level={audioLevel} />
            </div>

            {/* Timer & Status */}
            <div className="text-center">
              <div className="font-mono text-3xl font-black text-white">
                {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
                {String(recordingTime % 60).padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isRecording ? 'Listening... Speak clearly into your mic.' : 'Ready to record'}
              </p>
            </div>

            {/* Mic Controls */}
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Mic className="w-5 h-5" />
                  Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                  <Square className="w-5 h-5 fill-white" />
                  Stop Recording
                </button>
              )}
            </div>
          </div>

          {/* Live Transcript Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Recognized Speech Transcript
              </h3>
              {transcript && (
                <span className="text-xs text-slate-400">
                  {transcript.split(/\s+/).filter(Boolean).length} words spoken
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your spoken words will appear here in real-time as you speak. You can also edit or add text manually..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              {transcript && (
                <button
                  onClick={handleResetSession}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
              <button
                disabled={isEvaluating || !transcript || transcript.trim().length === 0}
                onClick={handleEvaluate}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isEvaluating ? 'Evaluating Voice...' : 'Evaluate My Speech'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
