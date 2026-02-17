
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
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Conquistas</h2>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Seu Progresso Profissional</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Score Section */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pontuação Total</span>
              <span className="text-4xl font-black text-indigo-600 font-mono">{state.score}</span>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl">
              🏆
            </div>
          </div>

          {/* Missions Section */}
          <section>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
              Missões Ativas
            </h3>
            <div className="space-y-3">
              {MISSIONS.map(mission => {
                const isCompleted = state.completedMissions.includes(mission.id);
                return (
                  <div key={mission.id} className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>{mission.title}</h4>
                      {isCompleted ? (
                         <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      ) : (
                        <span className="text-[10px] font-black text-indigo-500">+{mission.reward} PTS</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{mission.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Badges Section */}
          <section>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>
              Suas Insígnias
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const isEarned = state.badges.includes(badge.id);
                return (
                  <div key={badge.id} className={`flex flex-col items-center p-4 rounded-2xl border transition-all text-center ${isEarned ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100 grayscale opacity-40'}`}>
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase leading-tight mb-1">{badge.name}</h4>
                    <p className="text-[9px] text-slate-500 leading-tight">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
           <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Continue estudando para desbloquear mais!</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
