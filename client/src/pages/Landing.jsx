import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import {
  PenTool,
  CheckCircle2,
  Mic,
  MessagesSquare,
  Video,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  HeartHandshake,
  Clock,
  Compass,
  Star
} from 'lucide-react';

export const Landing = () => {
  const steps = [
    { num: '01', title: 'Choose a topic', desc: 'Select from essays, interview questions, stories, emails, or let AI generate one tailored to your level.' },
    { num: '02', title: 'Write within a time limit', desc: 'Beat the clock to build spontaneity and stop overthinking every single word.' },
    { num: '03', title: 'Get AI corrections', desc: 'Detailed, sentence-by-sentence feedback with clear grammar rules and vocabulary upgrades.' },
    { num: '04', title: 'Practice speaking', desc: 'Speak into your microphone with live speech-to-text and instant fluency evaluation.' },
    { num: '05', title: 'Practice in video scenarios', desc: 'Gradually overcome stage fear through realistic interviews and presentation simulations.' },
    { num: '06', title: 'Track your improvement', desc: 'Watch your communication scores climb week by week with transparent analytics.' },
  ];

  const features = [
    {
      title: 'Timed Writing Practice',
      desc: 'Overcome writer\'s block and hesitation with structured countdown writing exercises.',
      icon: PenTool,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'AI Writing Correction',
      desc: 'Transparent 6-category evaluation with exact mistake tables and contextual explanations.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'AI Voice Practice',
      desc: 'Mic speech capture, real-time audio waveform visualizer, and instant oral fluency feedback.',
      icon: Mic,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'AI Conversation',
      desc: 'Dynamic, supportive AI dialogue partner across 10 realistic personal and job scenarios.',
      icon: MessagesSquare,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'AI Video Practice',
      desc: 'Camera simulations that gently desensitize stage fear from voice-only to full presentations.',
      icon: Video,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      title: 'Progress Tracking',
      desc: 'Monitor fluency, confidence, vocabulary, and grammar gains over time with Recharts.',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-300/30 to-calm-200/40 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Practice privately. Make mistakes safely. Speak confidently.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Build Your English. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-calm-600">
              Build Your Confidence.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Practice writing, speaking and real-world communication with AI — privately and at your own pace.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Practicing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base border border-slate-200 shadow-xs transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Privacy & Safe Space Assurance */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>100% Private Practice Room</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-brand-600" />
              <span>No Judgment, No Pressure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Just 15–20 Mins a Day</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Learning Journey */}
      <section id="learning-journey" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">
              The Learning Journey
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              From Private Reflection to Confident Expression
            </p>
          </div>

          {/* Journey Flow Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {[
                { title: 'Write', desc: 'Express thoughts under timed pressure to build agility.' },
                { title: 'Correct', desc: 'Unpack mistakes with pedagogical explanations.' },
                { title: 'Speak', desc: 'Read & improvise voice practice out loud privately.' },
                { title: 'Practice', desc: 'Converse in job interviews and video scenarios.' },
                { title: 'Improve', desc: 'Watch your fluency & confidence score grow.' },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-calm-400 mb-2">
                      STAGE {idx + 1}
                    </div>
                    <div className="text-xl font-bold text-white mb-2">{stage.title}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{stage.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-brand-400">
                    <span>Progress</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Core Capabilities
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything You Need to Master English Communication
            </h3>
            <p className="mt-4 text-slate-600">
              Engineered specifically for ESL students and professionals who know English grammar rules in theory, but hesitate when writing or speaking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:translate-y-[-2px] flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl border ${feat.color} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (6 Steps) */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600">
              The 6-Step Method
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How SpeakWrite AI Works
            </h3>
            <p className="mt-4 text-slate-600">
              A structured, low-stress routine to turn hesitation into spontaneous fluency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative p-7 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col"
              >
                <div className="text-3xl font-black text-brand-600/30 mb-3">{step.num}</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical Confidence & Stage Fear Section */}
      <section id="confidence" className="py-16 bg-gradient-to-b from-brand-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-calm-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-calm-400" />
            <span>Gradual Exposure & Confidence Building</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Overcome Stage Fear and Interview Anxiety
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Stage fear is not a permanent personality trait — it is simply an unfamiliarity with the spotlight.
            By practicing in our progressive 4-level video simulator, you train your brain to stay calm under pressure.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-xl mx-auto text-xs text-slate-400">
            <strong>Note:</strong> SpeakWrite AI is designed for communication skill development and gradual confidence-building through structured practice. It is not intended as medical therapy for clinical anxiety disorders.
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-brand-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Start Your Practice Today
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">
            Join thousands of learners building English fluency without the fear of judgment.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-base shadow-xl transition-all hover:scale-105"
            >
              Start Your Practice
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">SpeakWrite AI</span>
            <span className="text-xs text-slate-500">© 2026. All rights reserved.</span>
          </div>
          <p className="text-xs text-slate-400">
            Practice privately. Make mistakes safely. Speak confidently.
          </p>
        </div>
      </footer>
    </div>
  );
};
