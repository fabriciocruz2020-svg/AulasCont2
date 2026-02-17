
import React, { useMemo } from 'react';
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

  const total = Math.max(assets, liabilitiesAndEquity, 100);
  const tilt = assets === liabilitiesAndEquity ? 0 : (assets > liabilitiesAndEquity ? -10 : 10);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold mb-6 text-slate-700">Equação Fundamental: A = P + PL</h3>
      
      <div className="relative w-full max-w-md h-64 flex flex-col items-center">
        {/* The Balance Beam */}
        <div 
          className="absolute top-1/2 w-full h-2 bg-slate-800 rounded-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-50%) rotate(${tilt}deg)` }}
        >
          {/* Left Plate (Assets) */}
          <div className="absolute left-0 -top-24 w-24 h-24 flex flex-col items-center justify-center">
            <div className="w-20 h-2 bg-slate-400 rounded-t-lg"></div>
            <div className="w-24 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-b-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-blue-500/40 transition-all duration-500" style={{height: `${(assets/total)*100}%`}}></div>
                <span className="relative font-bold text-blue-700">R$ {assets}</span>
            </div>
            <span className="mt-2 text-xs font-bold text-blue-600 uppercase">Ativos</span>
          </div>

          {/* Right Plate (P+PL) */}
          <div className="absolute right-0 -top-24 w-24 h-24 flex flex-col items-center justify-center">
            <div className="w-20 h-2 bg-slate-400 rounded-t-lg"></div>
            <div className="w-24 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-b-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-emerald-500/40 transition-all duration-500" style={{height: `${(liabilitiesAndEquity/total)*100}%`}}></div>
                <span className="relative font-bold text-emerald-700">R$ {liabilitiesAndEquity}</span>
            </div>
            <span className="mt-2 text-xs font-bold text-emerald-600 uppercase">Passivo + PL</span>
          </div>
        </div>

        {/* Pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-32 bg-slate-300 rounded-b-full"></div>
      </div>

      <div className="mt-8 flex gap-8 w-full">
        <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Bens e Direitos (Aplicações)</p>
            <p className="text-lg font-bold text-blue-800">R$ {assets}</p>
        </div>
        <div className="flex-1 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium">Obrigações e Sócios (Origens)</p>
            <p className="text-lg font-bold text-emerald-800">R$ {liabilitiesAndEquity}</p>
        </div>
      </div>
      
      {assets === liabilitiesAndEquity ? (
        <div className="mt-4 text-emerald-600 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Contas em Equilíbrio!
        </div>
      ) : (
        <div className="mt-4 text-red-500 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Balança Desequilibrada
        </div>
      )}
    </div>
  );
};

export default BalanceScale;
