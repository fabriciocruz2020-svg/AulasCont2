
import React from 'react';

interface AiAuditorPanelProps {
  isLoading: boolean;
  feedback: string | null;
  onClose: () => void;
}

const AiAuditorPanel: React.FC<AiAuditorPanelProps> = ({ isLoading, feedback, onClose }) => {
  if (!isLoading && !feedback) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-indigo-100 flex flex-col z-50 transform transition-transform animate-in slide-in-from-right duration-300">
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-1.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
            </div>
            <h4 className="font-bold">Auditor Axioma</h4>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 animate-pulse font-medium">Revisando os razonetes...</p>
          </div>
        ) : (
          <div className="prose prose-sm text-slate-600 leading-relaxed">
            {feedback?.split('\n').map((line, i) => (
              <p key={i} className="mb-3">{line}</p>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">Powered by Gemini AI</p>
      </div>
    </div>
  );
};

export default AiAuditorPanel;
