
import React from 'react';

interface ModuleCompletionOverlayProps {
  moduleNumber: number;
  onContinue: () => void;
}

const ModuleCompletionOverlay: React.FC<ModuleCompletionOverlayProps> = ({ moduleNumber, onContinue }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-50">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Módulo {moduleNumber} Completo!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Incrível! Você concluiu todos os desafios e tutoriais deste módulo. Seus fundamentos contábeis estão cada vez mais sólidos.
        </p>

        <div className="space-y-3">
            <button 
                onClick={onContinue}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
                {moduleNumber < 3 ? 'Desbloquear Próximo Módulo' : 'Continuar Explorando'}
            </button>
            <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
            >
                Reiniciar Jornada
            </button>
        </div>
        
        {/* Confetti-like elements decoration */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-20 delay-300"></div>
      </div>
    </div>
  );
};

export default ModuleCompletionOverlay;
