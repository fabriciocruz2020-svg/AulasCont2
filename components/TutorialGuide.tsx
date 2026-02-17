
import React from 'react';
import { TutorialStep } from '../types';

interface TutorialGuideProps {
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ step, currentStepIndex, totalSteps }) => {
  return (
    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl mb-8 relative overflow-hidden border border-indigo-400 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/10">
            Guia Axioma • Passo {currentStepIndex + 1} / {totalSteps}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 w-4 rounded-full transition-all ${i <= currentStepIndex ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 tracking-tight">{step.title}</h3>
        <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
          {step.instruction}
        </p>
        <div className="flex items-center gap-3 text-[11px] font-bold text-white bg-black/20 p-3 rounded-xl border border-white/10 shadow-inner">
            <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <span className="block opacity-60 uppercase text-[9px] mb-0.5">Objetivo do Lançamento</span>
              {step.targetDescription}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;
