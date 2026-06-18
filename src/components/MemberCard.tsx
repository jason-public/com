import React from 'react';
import { Member } from '../types';
import { Award, Briefcase, ChevronRight, Hash, Layers, ShieldCheck } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
  searchQuery: string;
  keywordQuery: string;
}

export default function MemberCard({
  member,
  onClick,
  searchQuery,
  keywordQuery,
}: MemberCardProps) {
  // Extract keywords to highlight
  const getSearchWords = (): string[] => {
    const words: string[] = [];
    if (searchQuery.trim()) {
      words.push(searchQuery.trim());
    }
    if (keywordQuery.trim()) {
      // Split by commas or spaces for multiple queries
      const parts = keywordQuery.split(/[\s,]+/).map(p => p.trim()).filter(Boolean);
      words.push(...parts);
    }
    return words;
  };

  const searchWords = getSearchWords();

  const highlight = (text: string, isCareer: boolean = false) => {
    if (!searchWords.length || !text) return <span>{text}</span>;
    
    // Escaping regex tokens
    const escaped = searchWords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .filter(Boolean);
      
    if (!escaped.length) return <span>{text}</span>;
    
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(pattern);
    
    return (
      <>
        {parts.map((part, i) =>
          pattern.test(part) ? (
            <mark
              key={i}
              className={`${
                isCareer
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-250/50'
                  : 'bg-emerald-100 text-emerald-950'
              } px-0.5 rounded-sm font-semibold`}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Color mapping based on organization for Professional Polish
  const orgColors: Record<string, { labelBg: string; text: string; bg: string }> = {
    인수위원단: {
      labelBg: 'bg-blue-50 text-blue-700 border-blue-100/60',
      text: 'text-blue-700',
      bg: 'text-blue-600',
    },
    특별위원단: {
      labelBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/60',
      text: 'text-emerald-700',
      bg: 'text-emerald-600',
    },
    자문위원단: {
      labelBg: 'bg-amber-50 text-amber-700 border-amber-100/60',
      text: 'text-amber-700',
      bg: 'text-amber-600',
    },
  };

  const colors = orgColors[member.organization] || {
    labelBg: 'bg-slate-50 text-slate-700 border-slate-200/60',
    text: 'text-slate-700',
    bg: 'text-slate-600',
  };

  const isLeader = member.position === '위원장' || member.position === '부위원장';

  return (
    <div
      id={`member-card-${member.id}`}
      onClick={onClick}
      className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full"
    >
      {/* Top organization identifier tag */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors.labelBg} uppercase tracking-wider`}>
          {member.organization}
        </span>
        <span className="text-slate-300 group-hover:text-blue-600 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>

      {/* Name and Title description */}
      <h3 className="text-lg font-bold text-slate-800 mb-0.5">
        {highlight(member.name)}
      </h3>
      
      {/* Subtitle containing Role & Department in professional colored text */}
      <p className={`${colors.text} text-xs font-bold mb-3 flex items-center gap-1.5`}>
        {member.position}
        <span className="text-slate-300 font-normal">|</span>
        <span className="text-slate-500 font-medium">{member.department}</span>
      </p>

      {/* Details/Careers with a top divider */}
      <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-2">[주요경력]</p>
          <ul className="space-y-1.5">
            {member.careers.map((career, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-slate-400 shrink-0 select-none">•</span>
                <span className="break-all">{highlight(career, true)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic button wrapper */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-blue-700 group-hover:text-blue-800/90 transition-colors">
          <span>상세 경력 및 인재카드 조회</span>
          <span className="inline-flex items-center justify-center w-5 h-5 bg-slate-55 rounded-full group-hover:bg-blue-50 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
