import React, { useState, useMemo } from 'react';
import { INITIAL_MEMBERS } from './data';
import { Member, OrganizationType, DepartmentType, PositionType } from './types';
import MemberCard from './components/MemberCard';
import MemberDetailModal from './components/MemberDetailModal';
import AnalyticsSection from './components/AnalyticsSection';
import StatCard from './components/StatCard';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Info,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Target,
  TrendingDown,
  Users,
} from 'lucide-react';

export default function App() {
  // Members State
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [keywordQuery, setKeywordQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('전체');
  const [selectedDept, setSelectedDept] = useState<string>('전체');
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');

  // Interactive Panel States
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Standardize values
  const orgsList = ['전체', '인수위원단', '특별위원단', '자문위원단'];
  
  const deptsList = [
    '전체',
    '기획자치분과',
    '미래경제분과',
    '도시교통환경분과',
    '복지문화교육분과',
    '재정혁신특위',
    '공동주택 관리비 특위',
    '해당없음'
  ];

  const positionsList = [
    '전체',
    '위원장(부위원장 포함)',
    '위원',
    '자문위원',
    '총괄간사'
  ];

  // Quick keyword suggestions as requested to make multi-keyword searching interactive
  const keywordSuggestions = [
    '교수',
    '연구원',
    '세무사',
    '변호사',
    '공무원',
    '아파트',
    '도시',
    '자문',
    '복지',
    '교통',
    '분석'
  ];

  // Primary filtering logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // 1. Name search (case-insensitive & space trimmed)
      if (searchQuery.trim()) {
        const nameMatch = member.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        if (!nameMatch) return false;
      }

      // 2. Organization filter
      if (selectedOrg !== '전체') {
        if (member.organization !== selectedOrg) return false;
      }

      // 3. Department filter
      if (selectedDept !== '전체') {
        if (member.department !== selectedDept) return false;
      }

      // 4. Position filter (standardized mapping)
      if (selectedPosition !== '전체') {
        if (selectedPosition === '위원장(부위원장 포함)') {
          if (member.position !== '위원장' && member.position !== '부위원장') {
            return false;
          }
        } else {
          if (member.position !== selectedPosition) {
            return false;
          }
        }
      }

      // 5. Career Keyword / Text Search (handles multiple keywords separated by space or commas)
      if (keywordQuery.trim()) {
        const keywords = keywordQuery
          .split(/[\s,]+/)
          .map(k => k.trim().toLowerCase())
          .filter(Boolean);

        if (keywords.length > 0) {
          // Check if ALL keywords match at least some career string
          const allMatch = keywords.every(keyword =>
            member.careers.some(career => career.toLowerCase().includes(keyword))
          );
          if (!allMatch) return false;
        }
      }

      return true;
    });
  }, [members, searchQuery, keywordQuery, selectedOrg, selectedDept, selectedPosition]);

  // Statistics calculation for dynamic counts
  const totalCount = INITIAL_MEMBERS.length;
  const matchCount = filteredMembers.length;

  const transitionCount = filteredMembers.filter(m => m.organization === '인수위원단').length;
  const specialCount = filteredMembers.filter(m => m.organization === '특별위원단').length;
  const advisoryCount = filteredMembers.filter(m => m.organization === '자문위원단').length;

  // Reset all filters in one click
  const handleResetFilters = () => {
    setSearchQuery('');
    setKeywordQuery('');
    setSelectedOrg('전체');
    setSelectedDept('전체');
    setSelectedPosition('전체');
  };

  // Quick select category
  const handleKeywordSelect = (kw: string) => {
    setKeywordQuery(kw);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between scroll-smooth font-sans text-slate-900">
      {/* 1. Professional Polish Header */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">남양주시 시민주권위원회 인적자원 검색</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Namyangju Citizen Sovereignty Committee Database</p>
          </div>
        </div>

        <div className="flex items-center gap-5 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            id="header-toggle-analytics"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>{showAnalytics ? '통계 대시보드 숨기기' : '통계 대시보드 열기'}</span>
          </button>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">TOTAL MEMBERS</span>
            <span className="text-blue-700 font-extrabold text-lg leading-none">{totalCount}명</span>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-grow flex flex-col gap-6">
        
        {/* Dynamic Statistics Cards */}
        <section id="statistics-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            id="stat-match"
            title="검색 매칭 위원"
            value={matchCount}
            icon={<Check className="w-4 h-4" />}
            description="현재 설정된 검색에 매치된 인원"
            colorClass="text-blue-700"
            bgColorClass="bg-blue-50/55 border-blue-105"
          />
          <StatCard
            id="stat-transition"
            title="인수위원단"
            value={transitionCount}
            icon={<Users className="w-4 h-4" />}
            description="활동 검토 및 위원 구성 지표"
            colorClass="text-indigo-600"
            bgColorClass="bg-indigo-50/55 border-indigo-105"
          />
          <StatCard
            id="stat-special"
            title="특별위원단"
            value={specialCount}
            icon={<Building2 className="w-4 h-4" />}
            description="복지/재정/공동주택 특위 위원"
            colorClass="text-emerald-700"
            bgColorClass="bg-emerald-50/55 border-emerald-105"
          />
          <StatCard
            id="stat-advisory"
            title="자문위원단"
            value={advisoryCount}
            icon={<Target className="w-4 h-4" />}
            description="전문 분야 최적 자문 자원"
            colorClass="text-amber-700"
            bgColorClass="bg-amber-50/55 border-amber-105"
          />
        </section>

        {/* Analytics Interactive Panel */}
        {showAnalytics && (
          <section id="analytics-panel" className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3 justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-450 uppercase flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                인력구성 비율 및 실시간 현황 통계
              </span>
            </div>
            <AnalyticsSection members={filteredMembers} />
          </section>
        )}

        {/* Search Control Dashboard - Professional Polish styled wrapper */}
        <section id="search-controls" className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">위원 상세 조건 검색 및 하향식 필터링</h2>
              <p className="text-xs text-slate-400 mt-1">이름을 기입하거나, 복수 키워드를 포함한 상세 경력 요소를 필터링 가능합니다.</p>
            </div>
            
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-200/80 flex items-center gap-1.5 transition-all self-stretch lg:self-auto justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-555" />
              <span>검색 조건 초기화</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Name search & suggestions */}
            <div className="flex flex-col gap-2">
              <label htmlFor="search-name-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                성명 검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="search-name-input"
                  type="text"
                  placeholder="예: 경성석, 손영희, 최병선"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm transition-all focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Middle Col: Career Keywords multi-keyword search */}
            <div className="flex flex-col gap-2">
              <label htmlFor="search-keyword-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                경력 키워드 검색 (다중 지원)
              </label>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="search-keyword-input"
                  type="text"
                  placeholder="예: 교수 세무사 (공백이나 반점 구분)"
                  value={keywordQuery}
                  onChange={e => setKeywordQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm transition-all focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Col: Standardized Position filter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="filter-position-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                직위 표준화 필터
              </label>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  id="filter-position-select"
                  value={selectedPosition}
                  onChange={e => setSelectedPosition(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm font-medium transition-all focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  {positionsList.map(pos => (
                    <option key={pos} value={pos}>
                      {pos === '전체' ? '전체 직위 보기' : pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Org & Dept selector grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Org select tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">1단계: 조직 대분류 선택</span>
              <div className="flex flex-wrap gap-2">
                {orgsList.map(org => {
                  const isActive = selectedOrg === org || (org === '전체' && selectedOrg === '전체');
                  return (
                    <button
                      key={org}
                      id={`tab-org-${org}`}
                      onClick={() => setSelectedOrg(org === '전체' ? '전체' : org as OrganizationType)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                        isActive
                          ? 'bg-blue-700 border-blue-700 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {org === '전체' ? '전체 조직 보기' : org}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dept selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">2단계: 해당 분과 / 특위 선택</span>
              <div className="relative">
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  id="filter-department-select"
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-all focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="전체">전체 분과 / 특위 일괄 조회</option>
                  <optgroup label="정규 분과위원회">
                    <option value="기획자치분과">기획자치분과</option>
                    <option value="미래경제분과">미래경제분과</option>
                    <option value="도시교통환경분과">도시교통환경분과</option>
                    <option value="복지문화교육분과">복지문화교육분과</option>
                  </optgroup>
                  <optgroup label="특별 소위원회">
                    <option value="재정혁신특위">재정혁신특위</option>
                    <option value="공동주택 관리비 특위">공동주택 관리비 특위</option>
                  </optgroup>
                  <optgroup label="기타 자문단">
                    <option value="해당없음">해당없음 / 규제혁파 등</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Keyword Tips */}
          <div className="flex flex-wrap gap-2 items-center mt-1 pt-2 border-t border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">추천 키워드:</span>
            <div className="flex flex-wrap gap-1.5">
              {keywordSuggestions.map(kw => (
                <button
                  key={kw}
                  id={`chip-keyword-${kw}`}
                  onClick={() => handleKeywordSelect(kw)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
                    keywordQuery === kw
                      ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* Results Info Bar */}
        <div id="results-count-bar" className="flex justify-between items-center bg-white py-3.5 px-6 rounded-lg border border-slate-200 text-xs text-slate-500">
          <span className="font-medium">
            현재 조건에 부합하는 위원이 총 <span className="text-blue-700 font-extrabold">{filteredMembers.length}</span>명 검색되었습니다.
          </span>
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Filtered Results ({matchCount} of {totalCount})
          </span>
        </div>

        {/* 3. Cards Grid */}
        {filteredMembers.length > 0 ? (
          <section
            id="members-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredMembers.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                onClick={() => setSelectedMember(member)}
                searchQuery={searchQuery}
                keywordQuery={keywordQuery}
              />
            ))}
          </section>
        ) : (
          <section id="no-results" className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <Info className="w-10 h-10 text-slate-350" />
            </div>
            <h3 className="text-base font-bold text-slate-800">조건에 부합하는 시민주권위원이 없습니다.</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              검색 키워드나 성명을 다르게 기입하거나 분과 필터를 해제해보세요.
            </p>
            <button
              id="btn-no-results-reset"
              onClick={handleResetFilters}
              className="mt-2 py-2 px-5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition"
            >
              검색 조건 리셋하기
            </button>
          </section>
        )}

      </main>

      {/* Profile Detail Overlay Portal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* Footer Info */}
      <footer className="bg-slate-800 text-white px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 text-xs mt-16">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium tracking-tight">
          <span className="opacity-50 uppercase">DATA SOURCE: NAMYANGJU CITY PDF 2024</span>
          <span className="w-px h-3 bg-slate-600 hidden sm:inline"></span>
          <span className="text-blue-400 font-bold">남양주시 공식 시민홍보 및 시장직인수 기구</span>
        </div>
        <div className="text-[11px] opacity-50">
          Copyright © 2026 Namyangju City. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
