
import React from 'react';
import { GameState, Badge, Mission } from '../types';
import { BADGES, MISSIONS } from '../constants';

interface GamificationPanelProps {
  state: GameState;
  isOpen: boolean;
  onClose: () => void;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ state, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l-2 border-slate-200">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Academia Contábil</h2>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Suas conquistas e metas</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
          {/* Score Section */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Acumulado</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-indigo-600 font-mono tracking-tighter">{state.score}</span>
                <span className="text-xs font-black text-indigo-400 uppercase">pts</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-center justify-center text-4xl shadow-inner">
              🏆
            </div>
          </div>

          {/* Missions Section */}
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-slate-200"></span>
              Missões de Carreira
              <span className="flex-1 h-px bg-slate-200"></span>
            </h3>
            <div className="space-y-4">
              {MISSIONS.map(mission => {
                const isCompleted = state.completedMissions.includes(mission.id);
                return (
                  <div key={mission.id} className={`p-5 rounded-2xl border-2 transition-all group ${isCompleted ? 'bg-emerald-50 border-emerald-200 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`text-sm font-black uppercase tracking-tight ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>{mission.title}</h4>
                      {isCompleted ? (
                         <div className="bg-emerald-500 text-white p-1 rounded-full">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                         </div>
                      ) : (
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">+{mission.reward} PTS</span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed font-medium ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>{mission.description}</p>
                    <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${isCompleted ? 'w-full bg-emerald-500' : 'w-0 bg-indigo-500'}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Badges Section */}
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-slate-200"></span>
              Insígnias de Honra
              <span className="flex-1 h-px bg-slate-200"></span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const isEarned = state.badges.includes(badge.id);
                return (
                  <div key={badge.id} className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all text-center group ${isEarned ? 'bg-white border-amber-200 shadow-md scale-100' : 'bg-slate-50 border-slate-100 grayscale opacity-40 scale-95'}`}>
                    <div className={`text-4xl mb-3 p-3 rounded-2xl transition-transform group-hover:scale-110 ${isEarned ? 'bg-amber-50 shadow-inner' : ''}`}>{badge.icon}</div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase leading-tight mb-1.5">{badge.name}</h4>
                    <p className="text-[9px] text-slate-500 font-bold leading-tight uppercase tracking-tighter">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t-2 border-slate-200">
           <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em]">Crescimento Contínuo</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
