import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft, Target, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const Onboarding = () => {
  const { user, saveOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [englishLevel, setEnglishLevel] = useState(user?.englishLevel || 'Intermediate');
  const [goals, setGoals] = useState(['Writing', 'Speaking', 'Confidence']);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [difficulties, setDifficulties] = useState(['I am afraid to speak', 'I make grammar mistakes']);
  const [saving, setSaving] = useState(false);

  const goalOptions = [
    { id: 'Writing', label: 'Writing', desc: 'Structure & clarity' },
    { id: 'Speaking', label: 'Speaking', desc: 'Fluency & conversation' },
    { id: 'Grammar', label: 'Grammar', desc: 'Sentence accuracy' },
    { id: 'Vocabulary', label: 'Vocabulary', desc: 'Lexical variety' },
    { id: 'Pronunciation', label: 'Pronunciation', desc: 'Accent & articulation' },
    { id: 'Confidence', label: 'Confidence', desc: 'Overcoming hesitation' },
    { id: 'Interview skills', label: 'Interview skills', desc: 'Job & college interviews' },
    { id: 'Public speaking', label: 'Public speaking', desc: 'Presentations & groups' },
  ];

  const dailyGoalOptions = [
    { value: 10, label: '10 minutes', sub: 'Light daily momentum' },
    { value: 20, label: '20 minutes', sub: 'Recommended balance' },
    { value: 30, label: '30 minutes', sub: 'Accelerated growth' },
    { value: 45, label: '45 minutes', sub: 'Intensive immersion' },
  ];

  const difficultyOptions = [
    "I don't know what to say",
    "I make grammar mistakes",
    "I lack vocabulary",
    "I am afraid to speak",
    "I have stage fear",
    "I lack confidence"
  ];

  const toggleGoal = (id) => {
    if (goals.includes(id)) {
      setGoals(goals.filter(g => g !== id));
    } else {
      setGoals([...goals, id]);
    }
  };

  const toggleDifficulty = (d) => {
    if (difficulties.includes(d)) {
      setDifficulties(difficulties.filter(item => item !== d));
    } else {
      setDifficulties([...difficulties, d]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await saveOnboarding({
        englishLevel,
        goals,
        dailyGoal,
        difficulties
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding:', err);
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        {/* Top Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm animate-fade-in">
          {/* Step 1: English Level */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Target className="w-4 h-4" />
                <span>Language Baseline</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">What is your current English level?</h2>
              <p className="mt-2 text-sm text-slate-500 mb-6">
                This helps us calibrate writing topics, speaking questions, and feedback depth.
              </p>

              <div className="space-y-3">
                {['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnglishLevel(lvl)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      englishLevel === lvl
                        ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-sm">{lvl}</span>
                    {englishLevel === lvl && (
                      <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: What to improve */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Improvement Focus</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">What do you want to improve?</h2>
              <p className="mt-2 text-sm text-slate-500 mb-6">
                Select all that apply. We tailor your dashboard and recommendations accordingly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((g) => {
                  const selected = goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGoal(g.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        selected
                          ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">{g.label}</span>
                        {selected && <Check className="w-4 h-4 text-brand-600" />}
                      </div>
                      <span className="text-xs text-slate-500">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Daily Practice Goal */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Daily Commitment</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">How much daily practice do you aim for?</h2>
              <p className="mt-2 text-sm text-slate-500 mb-6">
                Consistency beats intensity. Even 15–20 minutes daily triggers compound confidence.
              </p>

              <div className="space-y-3">
                {dailyGoalOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDailyGoal(opt.value)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      dailyGoal === opt.value
                        ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{opt.label}</span>
                      <p className="text-xs text-slate-500">{opt.sub}</p>
                    </div>
                    {dailyGoal === opt.value && (
                      <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Main Difficulty */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>Your Real-World Challenge</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">What is your biggest difficulty?</h2>
              <p className="mt-2 text-sm text-slate-500 mb-6">
                Be honest — this is your private space to overcome what holds you back.
              </p>

              <div className="space-y-2.5">
                {difficultyOptions.map((diff) => {
                  const selected = difficulties.includes(diff);
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => toggleDifficulty(diff)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">{diff}</span>
                      {selected && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20"
              >
                {saving ? 'Setting up...' : 'Go to My Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
