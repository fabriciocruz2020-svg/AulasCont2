
import React, { useState, useRef, useEffect } from 'react';
import { SwipeChallenge, EntryType } from '../types';

interface CardSwipeGameProps {
  challenges: SwipeChallenge[];
  currentIndex: number;
  onCorrect: () => void;
  onIncorrect: (explanation: string, challenge: SwipeChallenge) => void;
}

const CardSwipeGame: React.FC<CardSwipeGameProps> = ({ challenges, currentIndex, onCorrect, onIncorrect }) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const startX = useRef(0);
  
  const challenge = challenges[currentIndex];
  
  if (!challenge) return null;

  const handleSwipeAction = (side: EntryType) => {
    if (side === challenge.correctSide) {
      setDragX(side === EntryType.Credit ? 500 : -500);
      setTimeout(() => {
        setDragX(0);
        onCorrect();
      }, 300);
    } else {
      setIsShaking(true);
      onIncorrect(challenge.explanation, challenge);
      setTimeout(() => {
        setIsShaking(false);
        setDragX(0);
      }, 500);
    }
  };

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    setDragX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 150) {
      handleSwipeAction(EntryType.Credit);
    } else if (dragX < -150) {
      handleSwipeAction(EntryType.Debit);
    } else {
      setDragX(0);
    }
  };

  // Shadow and opacity based on drag
  const opacity = Math.max(1 - Math.abs(dragX) / 400, 0.5);
  const rotation = dragX * 0.1;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto">
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Desafio de Dualidade</h3>
        <p className="text-slate-500 text-sm font-medium">Arraste para a <span className="text-blue-600 font-bold underline">Esquerda (D)</span> ou <span className="text-emerald-600 font-bold underline">Direita (C)</span></p>
      </div>

      <div className="relative w-full h-[450px] flex items-center justify-center perspective-1000">
        {/* Indicators Background */}
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none opacity-20">
          <div className={`flex flex-col items-center transition-all duration-300 ${dragX < -50 ? 'scale-125 opacity-100' : ''}`}>
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border-4 border-blue-500/30 flex items-center justify-center text-4xl font-black text-blue-500">D</div>
            <span className="mt-3 font-black text-blue-500 uppercase tracking-widest text-[10px]">Débito</span>
          </div>
          <div className={`flex flex-col items-center transition-all duration-300 ${dragX > 50 ? 'scale-125 opacity-100' : ''}`}>
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center text-4xl font-black text-emerald-500">C</div>
            <span className="mt-3 font-black text-emerald-500 uppercase tracking-widest text-[10px]">Crédito</span>
          </div>
        </div>

        {/* The Card */}
        <div 
          className={`relative z-20 w-full max-w-[320px] h-[400px] bg-white rounded-[2.5rem] shadow-2xl border-2 p-10 flex flex-col items-center justify-center transition-transform select-none cursor-grab active:cursor-grabbing ${isDragging ? 'duration-0' : 'duration-500'} ${isShaking ? 'animate-shake border-rose-500' : 'border-slate-100'}`}
          style={{ 
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            opacity: opacity,
            borderColor: dragX > 80 ? '#10b981' : dragX < -80 ? '#3b82f6' : '#f1f5f9',
            boxShadow: dragX > 80 ? '0 20px 40px -10px rgba(16,185,129,0.3)' : dragX < -80 ? '0 20px 40px -10px rgba(59,130,246,0.3)' : '0 25px 50px -12px rgba(0,0,0,0.1)'
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
             <div className="w-8 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          </div>

          <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 relative">
            <span className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Contexto</span>
            <p className="text-xl font-bold text-slate-700 leading-tight italic">
              "{challenge.scenario}"
            </p>
          </div>

          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-2">Conta Contábil</span>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{challenge.accountName}</h4>
            <div className="h-1.5 w-12 bg-indigo-600 rounded-full"></div>
          </div>

          <div className="mt-auto pt-8 flex gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300"></div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-300"></div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-300"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-6">
        <button 
          onClick={() => handleSwipeAction(EntryType.Debit)}
          className="group relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative px-8 py-4 bg-white border-2 border-blue-500 text-blue-600 font-black rounded-2xl shadow-lg hover:bg-blue-50 transition-all active:scale-90 flex flex-col items-center">
             <span className="text-xs uppercase">DÉBITO</span>
             <span className="text-[9px] opacity-60">Aplicação</span>
          </div>
        </button>

        <button 
          onClick={() => handleSwipeAction(EntryType.Credit)}
          className="group relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all active:scale-90 flex flex-col items-center">
             <span className="text-xs uppercase">CRÉDITO</span>
             <span className="text-[9px] opacity-60">Origem</span>
          </div>
        </button>
      </div>

      <div className="mt-10 flex gap-1.5">
        {challenges.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-indigo-600' : i < currentIndex ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-200'}`}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CardSwipeGame;
