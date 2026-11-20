import React, { useState, useEffect, useRef } from 'react';
import {
  MessagesSquare,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  User,
  Bot,
  Award,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { voiceAPI } from '../services/api';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const VoiceConversation = () => {
  const scenarios = [
    { id: 'Daily Conversation', label: 'Daily Conversation', starter: "Hi there! It's so nice to chat with you today. How has your week been going so far?" },
    { id: 'Job Interview', label: 'Job Interview', starter: "Welcome to our interview. To begin, could you tell me a little bit about yourself and your professional background?" },
    { id: 'College Interview', label: 'College Interview', starter: "Hello! We are delighted to meet you. What motivated you to choose this academic field of study?" },
    { id: 'Travel', label: 'Travel & Airport', starter: "Excuse me, sir/ma'am! Can I see your boarding pass and passport, and where are you flying today?" },
    { id: 'Restaurant', label: 'Restaurant Ordering', starter: "Good evening! Welcome to Bistro Lumière. Have you decided on drinks or would you like to hear today's chef specials?" },
    { id: 'Customer Service', label: 'Customer Service', starter: "Thank you for calling support. My name is Alex. How can I assist you with your order today?" },
    { id: 'Group Discussion', label: 'Group Discussion', starter: "Our discussion topic today is: 'Is artificial intelligence a threat to creative careers?' Who would like to lead off?" },
    { id: 'IELTS Speaking', label: 'IELTS Speaking', starter: "Good afternoon. My name is Dr. Evans. In this first part, I would like to ask you some questions about your hometown." },
    { id: 'Public Speaking', label: 'Public Speaking', starter: "The audience is seated and the spotlight is on you. Please deliver your opening keynote remark." },
    { id: 'Self Introduction', label: 'Self Introduction', starter: "Welcome to our English meetup circle! Go ahead and introduce yourself, your interests, and what you hope to achieve here." }
  ];

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: scenarios[0].starter }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [conversationReport, setConversationReport] = useState(null);

  const { isRecording, transcript, setTranscript, startRecording, stopRecording, resetAudio } = useAudioRecorder();
  const { speak, pause, resume, stop, isPlaying, isPaused } = useSpeechSynthesis();

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiReplying]);

  // Handle scenario change
  const handleSelectScenario = (sc) => {
    stop();
    setSelectedScenario(sc);
    setMessages([{ role: 'assistant', content: sc.starter }]);
    setConversationReport(null);
    resetAudio();
  };

  // Sync mic transcript into input box
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Send message
  const handleSendMessage = async (textToSend) => {
    const content = textToSend || inputText;
    if (!content || !content.trim()) return;

    if (isRecording) {
      stopRecording();
    }

    const updated = [...messages, { role: 'user', content: content.trim() }];
    setMessages(updated);
    setInputText('');
    setTranscript('');
    setIsAiReplying(true);

    try {
      const res = await voiceAPI.respond({
        scenario: selectedScenario.id,
        messageHistory: updated
      });

      if (res.data.success && res.data.reply) {
        const aiMessage = { role: 'assistant', content: res.data.reply };
        setMessages((prev) => [...prev, aiMessage]);

        // Speak AI response automatically
        speak(res.data.reply);
      }
    } catch (err) {
      console.error('Conversation response error:', err);
    } finally {
      setIsAiReplying(false);
    }
  };

  // End conversation & evaluate
  const handleFinishConversation = async () => {
    stop();
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) {
      alert('Please speak or send at least one response before generating your evaluation.');
      return;
    }

    const combinedTranscript = userMessages.map(m => m.content).join(' ');

    try {
      const res = await voiceAPI.evaluate({
        scenario: selectedScenario.id,
        transcript: combinedTranscript,
        duration: userMessages.length * 35
      });

      if (res.data.success) {
        setConversationReport(res.data.session);
      }
    } catch (err) {
      console.error('Finish conversation error:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
          <MessagesSquare className="w-4 h-4" />
          <span>Natural Dialogue Partner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Voice Conversation
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Simulate spontaneous real-world dialogue. Listen to the AI speak its responses, answer using voice or text, and receive a full conversational scorecard.
        </p>
      </div>

      {conversationReport ? (
        /* End of Session Diagnostic Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Conversation Completed
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {selectedScenario.label} Diagnostic
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total dialogue exchanges: {messages.filter(m => m.role === 'user').length} turns
              </p>
            </div>
            <ScoreBadge score={conversationReport.scores?.overallScore || 72} size="xl" showLabel label="Overall Score" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Fluency', score: conversationReport.scores?.fluency || 75 },
              { label: 'Grammar', score: conversationReport.scores?.grammar || 70 },
              { label: 'Vocabulary', score: conversationReport.scores?.vocabulary || 72 },
              { label: 'Pronunciation', score: conversationReport.scores?.pronunciation || 76 },
              { label: 'Confidence', score: conversationReport.scores?.confidence || 70 },
            ].map((s) => (
              <div key={s.label} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{s.score}/100</div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-sm text-purple-900 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Coach Feedback
            </div>
            <p className="text-xs leading-relaxed text-purple-800">
              You maintained conversational composure across multi-turn interactions. Continue focusing on expanding vocabulary variety and transitioning without hesitations.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleSelectScenario(selectedScenario)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Conversation
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Scenarios Selector */}
          <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Select Scenario
            </h3>
            <div className="space-y-1">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedScenario.id === sc.id
                      ? 'bg-purple-50 text-purple-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Chat & Audio Arena */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
            {/* Header with audio controls */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedScenario.label}</h4>
                  <p className="text-[10px] text-slate-500">AI Conversation Partner</p>
                </div>
              </div>

              {/* TTS Controls */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 mr-1">Voice:</span>
                {isPlaying ? (
                  <button
                    onClick={pause}
                    title="Pause Voice"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resume}
                    title="Resume Voice"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-700" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const lastAi = [...messages].reverse().find(m => m.role === 'assistant');
                      if (lastAi) speak(lastAi.content);
                    }}
                    title="Replay Last AI Response"
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={stop}
                  title="Stop Audio"
                  className="p-1 hover:bg-slate-100 rounded text-rose-500"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-purple-600 text-white font-medium rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {m.content}
                    {m.role === 'assistant' && (
                      <button
                        onClick={() => speak(m.content)}
                        className="ml-2 text-slate-400 hover:text-purple-600 inline-flex items-center"
                        title="Listen to this response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                      Me
                    </div>
                  )}
                </div>
              ))}

              {isAiReplying && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  AI partner is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Controls & End Session button */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="flex items-center gap-2">
                {/* Voice Record Toggle */}
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    title="Speak into microphone"
                    className="p-3 bg-white border border-slate-200 hover:border-purple-300 text-purple-600 rounded-2xl shadow-xs transition-colors flex-shrink-0"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    title="Stop speaking"
                    className="p-3 bg-rose-500 text-white rounded-2xl shadow-md animate-pulse flex-shrink-0"
                  >
                    <Square className="w-5 h-5 fill-white" />
                  </button>
                )}

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isRecording ? 'Listening to your speech...' : 'Type or speak your answer...'}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                />

                <button
                  disabled={isAiReplying || !inputText.trim()}
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">
                  Tip: Speak naturally as you would to a friend or colleague.
                </span>
                <button
                  onClick={handleFinishConversation}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Finish & Get Evaluation Score →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
