import React, { useState } from 'react';
import { Member } from '../types';
import { Award, Briefcase, Calendar, Check, Copy, Download, Layers, ShieldCheck, X } from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
}

export default function MemberDetailModal({
  member,
  onClose,
}: MemberDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  // Handle Copy to Clipboard
  const handleCopy = () => {
    const text = `
[남양주시 시민주권위원회 인재정보]
성명: ${member.name}
직위: ${member.position}
조직 구분: ${member.organization}
해당 분과: ${member.department}

[대외 경력 및 이력]
${member.careers.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Export as text file download
  const handleDownloadFile = () => {
    const filename = `시민주권위원회_${member.name}_경력정보.txt`;
    const text = `
=========================================
남양주시 시민주권위원회 위원 인적정보
=========================================
성명: ${member.name}
직위: ${member.position}
조직 분류: ${member.organization}
소속 분과: ${member.department}

대외 약력 및 주요 경력:
----------------------------------------
${member.careers.map((c, i) => `- ${c}`).join('\n')}

=========================================
      `.trim();
    
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      id="member-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div 
        id="modal-container"
        className="relative bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-scale-up border border-slate-200 flex flex-col"
      >
        {/* Modal Header Decoration */}
        <div className="h-1.5 bg-blue-700" />
        
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Main Visual Profile Summary */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-200">
            <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-750 font-bold text-2xl flex items-center justify-center border border-blue-150 shrink-0 select-none">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {member.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {member.position}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Namyangju Sovereignty Committee Card
              </p>
            </div>
          </div>

          {/* Core Fields Grid */}
          <div className="py-6 grid grid-cols-2 gap-4 border-b border-slate-200">
            <div className="flex flex-col gap-1 p-3.5 bg-slate-50 rounded-lg border border-slate-250/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                조직 구분
              </span>
              <span className="text-sm font-bold text-slate-800">
                {member.organization}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 p-3.5 bg-slate-50 rounded-lg border border-slate-250/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                해당 분과
              </span>
              <span className="text-sm font-bold text-slate-800">
                {member.department}
              </span>
            </div>
          </div>

          {/* Careers segment */}
          <div className="py-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4 text-blue-700" />
              <span>상세 경력 및 핵심 역량 요약</span>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {member.careers.map((career, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100 shrink-0">
                      {index + 1}
                    </div>
                    {index < member.careers.length - 1 && (
                      <div className="w-0.5 bg-slate-150 flex-grow my-1" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs text-slate-755 leading-relaxed font-medium">
                      {career}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex gap-2.5 mt-6 border-t border-slate-200 pt-6">
            <button
              id="modal-btn-copy"
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold border transition-all duration-200 ${
                copied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-705'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? '복사 완료!' : '경력 텍스트 복사'}</span>
            </button>
            
            <button
              id="modal-btn-download"
              onClick={handleDownloadFile}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 border border-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>텍스트 파일 다운로드</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Decorative Disclaimer */}
        <div className="bg-slate-50 p-4 border-t border-slate-205 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            본 위원회 인력자원 검색 시스템의 정보는 남양주시 공식 출범 보도자료를 기반으로 구성되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
