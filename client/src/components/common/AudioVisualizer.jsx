import React from 'react';

export const AudioVisualizer = ({ isRecording, level = 0, barCount = 18 }) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 px-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
      {bars.map((i) => {
        // Compute dynamic height based on audio level and center-weighted distribution
        const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
        const centerFactor = 1 - centerDist * 0.5;

        let heightPercent = 15;
        if (isRecording) {
          const dynamicBoost = (level * centerFactor * 0.8) + (Math.sin((i + Date.now() / 100) * 0.8) * 15);
          heightPercent = Math.min(100, Math.max(15, dynamicBoost));
        }

        return (
          <div
            key={i}
            className="w-1.5 rounded-full transition-all duration-75 ease-out bg-gradient-to-t from-brand-500 via-calm-500 to-emerald-400"
            style={{
              height: `${heightPercent}%`,
              opacity: isRecording ? 0.9 : 0.25
            }}
          />
        );
      })}
    </div>
  );
};
