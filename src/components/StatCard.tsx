import React from 'react';

interface StatCardProps {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
  bgColorClass: string;
}

export default function StatCard({
  id,
  title,
  value,
  icon,
  description,
  colorClass,
  bgColorClass,
}: StatCardProps) {
  return (
    <div
      id={id}
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>
            {value}
          </span>
          <span className="text-xs font-semibold text-slate-450">명</span>
        </div>
        <p className="text-xs text-slate-550 mt-1.5 leading-snug">{description}</p>
      </div>
      <div className={`p-2.5 rounded-lg border ${bgColorClass} ${colorClass} shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
