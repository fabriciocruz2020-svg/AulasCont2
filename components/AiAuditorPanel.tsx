
import React from 'react';

interface AiAuditorPanelProps {
  isLoading: boolean;
  feedback: string | null;
  onClose: () => void;
}

const AiAuditorPanel: React.FC<AiAuditorPanelProps> = ({ isLoading, feedback, onClose }) => {
  if (!isLoading && !feedback) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] border-l-2 border-indigo-100 flex flex-col z-50 transform transition-transform animate-in slide-in-from-right duration-300">
      <div className="p-5 bg-indigo-600 text-white flex justify-between items-center shadow-lg relative z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-1.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight">Auditor Axioma</h4>
              <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Consultoria Online</p>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest animate-pulse">Auditando Lançamentos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 border-2 border-indigo-100 p-5 rounded-2xl rounded-tr-none shadow-sm relative">
              <div className="prose prose-sm text-indigo-900 leading-relaxed font-medium">
                {feedback?.split('\n').map((line, i) => (
                  <p key={i} className="mb-3 last:mb-0">{line}</p>
                ))}
              </div>
              <div className="absolute top-0 -right-2 w-4 h-4 bg-indigo-100 rotate-45"></div>
            </div>
            <p className="text-[9px] text-slate-400 text-center font-bold italic">O auditor IA avalia a lógica patrimonial e de dualidade.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-slate-100 bg-white">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
          <p className="text-[9px] text-slate-400 text-center uppercase tracking-widest font-black">Sistema de Inteligência Ativo</p>
        </div>
      </div>
    </div>
  );
};

export default AiAuditorPanel;
