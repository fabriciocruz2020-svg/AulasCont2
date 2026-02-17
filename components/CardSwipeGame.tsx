
import React, { useState } from 'react';
import { SwipeChallenge, EntryType } from '../types';

interface CardSwipeGameProps {
  challenges: SwipeChallenge[];
  currentIndex: number;
  onCorrect: () => void;
  onIncorrect: (feedback: string) => void;
}

const CardSwipeGame: React.FC<CardSwipeGameProps> = ({ challenges, currentIndex, onCorrect, onIncorrect }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const challenge = challenges[currentIndex];
  
  if (!challenge) return null;

  const handleSwipe = (side: EntryType) => {
    if (side === challenge.correctSide) {
      onCorrect();
    } else {
      onIncorrect(challenge.explanation);
    }
    setSwipeOffset(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Treinamento de Dualidade</h3>
        <p className="text-slate-500 text-sm">Decida: O valor está ENTRANDO ou SAINDO desta conta?</p>
      </div>

      <div className="relative w-full max-w-sm aspect-[3/4] perspective-1000">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-0">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black border-4 border-blue-500">D</div>
            <span className="text-[10px] font-bold text-blue-500 uppercase mt-2">Débito (Aplicação)</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black border-4 border-emerald-500">C</div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase mt-2">Crédito (Origem)</span>
          </div>
        </div>

        <div 
          className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-grab active:cursor-grabbing overflow-hidden"
          style={{ 
            transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
            borderColor: swipeOffset > 50 ? '#10b981' : swipeOffset < -50 ? '#3b82f6' : '#e2e8f0'
          }}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const onMouseMove = (moveE: MouseEvent) => {
              setSwipeOffset(moveE.clientX - startX);
            };
            const onMouseUp = (upE: MouseEvent) => {
              const diff = upE.clientX - startX;
              if (diff > 120) handleSwipe(EntryType.Credit);
              else if (diff < -120) handleSwipe(EntryType.Debit);
              else setSwipeOffset(0);
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          <div className="mb-6 bg-slate-100 p-4 rounded-2xl w-full">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Cenário</span>
            <p className="text-lg font-medium text-slate-700 leading-tight">{challenge.scenario}</p>
          </div>

          <div className="w-full h-px bg-slate-100 my-4"></div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Conta Alvo</span>
            <h4 className="text-3xl font-black text-indigo-600 tracking-tight">{challenge.accountName}</h4>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-8 opacity-40">
            <div className="flex-1 h-1 bg-blue-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          onClick={() => handleSwipe(EntryType.Debit)}
          className="px-8 py-3 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
        >
          Débito
        </button>
        <button 
          onClick={() => handleSwipe(EntryType.Credit)}
          className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
        >
          Crédito
        </button>
      </div>

      <div className="mt-8 flex gap-1">
        {challenges.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-indigo-500' : i < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default CardSwipeGame;
