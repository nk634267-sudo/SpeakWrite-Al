import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const MistakeHighlight = ({ text, mistakes = [] }) => {
  const [selectedMistake, setSelectedMistake] = useState(null);

  if (!mistakes || mistakes.length === 0 || !text) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-slate-200 font-normal leading-relaxed text-slate-800 whitespace-pre-wrap">
        {text}
      </div>
    );
  }

  // Sort mistakes by original string length descending so longer phrases match first
  const sortedMistakes = [...mistakes].filter(m => m.original && text.toLowerCase().includes(m.original.toLowerCase()));

  if (sortedMistakes.length === 0) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-slate-200 font-normal leading-relaxed text-slate-800 whitespace-pre-wrap">
        {text}
      </div>
    );
  }

  // Build regex from mistakes
  const escaped = sortedMistakes.map(m => m.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <div className="space-y-3">
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm font-normal leading-relaxed text-slate-800 text-base">
        {parts.map((part, index) => {
          const match = sortedMistakes.find(m => m.original.toLowerCase() === part.toLowerCase());
          if (match) {
            return (
              <span
                key={index}
                onClick={() => setSelectedMistake(selectedMistake === match ? null : match)}
                className="inline-block relative cursor-pointer px-1 py-0.5 mx-0.5 rounded bg-rose-100/90 text-rose-900 border-b-2 border-rose-500 font-medium hover:bg-rose-200 transition-colors"
                title={`Click for correction: ${match.correction}`}
              >
                {part}
                <span className="text-[10px] font-bold ml-1 px-1 py-0.2 bg-rose-500 text-white rounded-full uppercase">
                  {match.category || 'Error'}
                </span>
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>

      {selectedMistake && (
        <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl animate-fade-in flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-rose-800 line-through">"{selectedMistake.original}"</span>
              <span className="text-slate-400">→</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                "{selectedMistake.correction}"
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md">
                {selectedMistake.category}
              </span>
            </div>
            <p className="text-slate-700 leading-normal">{selectedMistake.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
