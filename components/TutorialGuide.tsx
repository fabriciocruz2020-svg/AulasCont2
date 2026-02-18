
import React from 'react';
import { TutorialStep } from '../types';

interface TutorialGuideProps {
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ step, currentStepIndex, totalSteps }) => {
  return (
    <div className="bg-slate-900 text-white p-7 rounded-3xl shadow-2xl mb-8 relative overflow-hidden border-2 border-indigo-500/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-300">
              Passo {currentStepIndex + 1} de {totalSteps}
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 w-5 rounded-full transition-all duration-500 ${i <= currentStepIndex ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-black mb-2 tracking-tight text-white">{step.title}</h3>
          <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-indigo-500/20 mb-6 shadow-inner">
          <p className="text-indigo-50 text-base leading-relaxed font-medium italic">
            "{step.instruction}"
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-bold text-white bg-indigo-600/20 p-4 rounded-2xl border border-indigo-400/30 shadow-lg">
            <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center border border-indigo-400/50 flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="block opacity-50 uppercase text-[9px] mb-0.5 tracking-widest">Missão Técnica</span>
              <span className="text-indigo-100 text-sm font-bold leading-tight">{step.targetDescription}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;
