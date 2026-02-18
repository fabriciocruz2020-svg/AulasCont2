
import React, { useMemo, useEffect, useState } from 'react';
import { Account, AccountCategory } from '../types';

interface BalanceScaleProps {
  accounts: Account[];
}

const BalanceScale: React.FC<BalanceScaleProps> = ({ accounts }) => {
  const assets = useMemo(() => 
    accounts.filter(a => a.category === AccountCategory.Asset).reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );
  
  const liabilitiesAndEquity = useMemo(() => 
    accounts.filter(a => a.category === AccountCategory.Liability || a.category === AccountCategory.Equity)
            .reduce((sum, a) => sum + a.balance, 0),
    [accounts]
  );

  const [prevAssets, setPrevAssets] = useState(assets);
  const [prevLiab, setPrevLiab] = useState(liabilitiesAndEquity);
  const [assetAnim, setAssetAnim] = useState<'none' | 'increase' | 'decrease'>('none');
  const [liabAnim, setLiabAnim] = useState<'none' | 'increase' | 'decrease'>('none');

  useEffect(() => {
    if (assets > prevAssets) setAssetAnim('increase');
    else if (assets < prevAssets) setAssetAnim('decrease');
    
    if (liabilitiesAndEquity > prevLiab) setLiabAnim('increase');
    else if (liabilitiesAndEquity < prevLiab) setLiabAnim('decrease');

    const timer = setTimeout(() => {
        setAssetAnim('none');
        setLiabAnim('none');
    }, 1000);
    
    setPrevAssets(assets);
    setPrevLiab(liabilitiesAndEquity);
    return () => clearTimeout(timer);
  }, [assets, liabilitiesAndEquity]);

  const total = Math.max(assets, liabilitiesAndEquity, 100);
  const tilt = assets === liabilitiesAndEquity ? 0 : (assets > liabilitiesAndEquity ? -8 : 8);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
      
      <h3 className="text-sm font-black mb-10 text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          Equilíbrio Patrimonial
      </h3>
      
      <div className="relative w-full max-w-md h-64 flex flex-col items-center">
        {/* The Balance Beam */}
        <div 
          className="absolute top-1/2 w-full h-2 bg-slate-800 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: `translateY(-50%) rotate(${tilt}deg)` }}
        >
          {/* Left Plate (Assets) */}
          <div className="absolute left-0 -top-32 w-28 h-32 flex flex-col items-center justify-center">
            <div className="w-24 h-2 bg-slate-400 rounded-t-lg shadow-sm"></div>
            <div className={`w-32 h-20 bg-blue-500/10 border-2 border-blue-500 rounded-b-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 ${assetAnim === 'increase' ? 'scale-110 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : assetAnim === 'decrease' ? 'scale-90 opacity-80' : ''}`}>
                <div className="absolute bottom-0 w-full bg-blue-500/30 transition-all duration-1000 ease-out" style={{height: `${(assets/total)*100}%`}}></div>
                <span className="relative font-mono font-black text-blue-700 text-lg">R$ {assets.toLocaleString('pt-BR')}</span>
            </div>
            <span className="mt-3 text-[10px] font-black text-blue-500 uppercase tracking-widest">Aplicações</span>
          </div>

          {/* Right Plate (P+PL) */}
          <div className="absolute right-0 -top-32 w-28 h-32 flex flex-col items-center justify-center">
            <div className="w-24 h-2 bg-slate-400 rounded-t-lg shadow-sm"></div>
            <div className={`w-32 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-b-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 ${liabAnim === 'increase' ? 'scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : liabAnim === 'decrease' ? 'scale-90 opacity-80' : ''}`}>
                <div className="absolute bottom-0 w-full bg-emerald-500/30 transition-all duration-1000 ease-out" style={{height: `${(liabilitiesAndEquity/total)*100}%`}}></div>
                <span className="relative font-mono font-black text-emerald-700 text-lg">R$ {liabilitiesAndEquity.toLocaleString('pt-BR')}</span>
            </div>
            <span className="mt-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Origens</span>
          </div>
        </div>

        {/* Pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-10 h-32 bg-slate-100 border-x border-slate-200 rounded-b-full shadow-inner"></div>
      </div>

      <div className="mt-12 flex gap-4 w-full">
        <div className="flex-1 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
            <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Ativos Totais</p>
            <p className="text-xl font-black text-blue-800 font-mono">R$ {assets.toLocaleString('pt-BR')}</p>
        </div>
        <div className="flex-1 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-1">Passivo + PL</p>
            <p className="text-xl font-black text-emerald-800 font-mono">R$ {liabilitiesAndEquity.toLocaleString('pt-BR')}</p>
        </div>
      </div>
      
      {assets === liabilitiesAndEquity ? (
        <div className="mt-6 text-emerald-600 font-black text-xs flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 animate-in fade-in zoom-in duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            EQUAÇÃO EQUILIBRADA
        </div>
      ) : (
        <div className="mt-6 text-rose-500 font-black text-xs flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            BALANÇA EM DESAFIO
        </div>
      )}
    </div>
  );
};

export default BalanceScale;
