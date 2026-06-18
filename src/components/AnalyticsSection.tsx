import React from 'react';
import { Member } from '../types';
import { Award, Briefcase, Building, Layers, PieChart, Users } from 'lucide-react';

interface AnalyticsSectionProps {
  members: Member[];
}

export default function AnalyticsSection({ members }: AnalyticsSectionProps) {
  // 1. Calc Org counts
  const total = members.length;
  const orgCounts = members.reduce(
    (acc, m) => {
      acc[m.organization] = (acc[m.organization] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // 2. Calc Department counts
  const deptCounts = members.reduce(
    (acc, m) => {
      acc[m.department] = (acc[m.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // 3. Calc Positions counts  
  const posCounts = members.reduce(
    (acc, m) => {
      acc[m.position] = (acc[m.position] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Department metadata with refined professional slate color palettes
  const deptColors: Record<string, string> = {
    기획자치분과: 'bg-blue-700',
    미래경제분과: 'bg-amber-500',
    도시교통환경분과: 'bg-emerald-600',
    복지문화교육분과: 'bg-sky-500',
    재정혁신특위: 'bg-purple-600',
    '공동주택 관리비 특위': 'bg-teal-600',
    해당없음: 'bg-slate-400',
  };

  return (
    <div
      id="analytics-section"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm"
    >
      {/* 1. Organizations Distribution (Progress style) */}
      <div id="analytics-orgs" className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <PieChart className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">조직 분류 현황</h4>
        </div>
        
        <div className="space-y-4 pt-1">
          {['인수위원단', '특별위원단', '자문위원단'].map(org => {
            const count = orgCounts[org] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            
            const fillColors: Record<string, string> = {
              인수위원단: 'bg-blue-700',
              특별위원단: 'bg-emerald-600',
              자문위원단: 'bg-amber-500',
            };

            return (
              <div key={org} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-600">{org}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-slate-800">{count}</span>
                    <span className="text-[10px] font-medium text-slate-400">명 ({pct.toFixed(0)}%)</span>
                  </div>
                </div>
                {/* Custom animated-looking bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${fillColors[org] || 'bg-slate-500'} rounded-full transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Department Breakdown */}
      <div id="analytics-depts" className="flex flex-col gap-4 md:border-l md:border-slate-100 md:pl-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">분과 및 특위 분포</h4>
        </div>

        <div className="space-y-3 pt-1 overflow-y-auto max-h-56 pr-1">
          {Object.entries(deptCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([dept, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={dept} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${deptColors[dept] || 'bg-slate-500'} shrink-0`} />
                  <div className="flex-grow flex justify-between items-baseline">
                    <span className="text-xs font-medium text-slate-600 truncate max-w-40">{dept}</span>
                    <span className="text-xs font-bold text-slate-800 shrink-0">
                      {count}명 <span className="text-[10px] text-slate-400 font-normal">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Key Roles Overview */}
      <div id="analytics-roles" className="flex flex-col gap-4 md:border-l md:border-slate-100 md:pl-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">직위 및 임원 비율</h4>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">대표단 임원</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-blue-700">
                {(posCounts['위원장'] || 0) + (posCounts['부위원장'] || 0)}
              </span>
              <span className="text-[10px] font-medium text-slate-400">명</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">일반 위원</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-indigo-700">
                {posCounts['위원'] || 0}
              </span>
              <span className="text-[10px] font-medium text-slate-400">명</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">전문 자문단</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-emerald-700">
                {posCounts['자문위원'] || 0}
              </span>
              <span className="text-[10px] font-medium text-slate-400">명</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">실무 총괄</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-amber-700">
                {posCounts['총괄간사'] || 0}
              </span>
              <span className="text-[10px] font-medium text-slate-400">명</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
