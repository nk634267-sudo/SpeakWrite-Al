import React from 'react';

export const ScoreBadge = ({ score, size = 'md', showLabel = false, label = 'Score' }) => {
  const num = Math.round(Number(score) || 0);

  let colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
  let badgeColor = 'text-rose-600';
  if (num >= 80) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    badgeColor = 'text-emerald-600';
  } else if (num >= 65) {
    colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    badgeColor = 'text-indigo-600';
  } else if (num >= 50) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeColor = 'text-amber-600';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-sm px-2.5 py-1 font-semibold',
    lg: 'text-xl px-3.5 py-1.5 font-bold',
    xl: 'text-3xl px-5 py-3 font-extrabold',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {showLabel && <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>}
      <span className={`inline-flex items-center justify-center rounded-xl border ${colorClass} ${sizeClasses[size]}`}>
        {num}<span className="text-[0.65em] font-normal opacity-70 ml-0.5">/100</span>
      </span>
    </div>
  );
};
