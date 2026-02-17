
import React from 'react';
import { Account, AccountCategory } from '../types';

interface FinancialReportsProps {
  accounts: Account[];
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ accounts }) => {
  const getBalance = (id: string) => accounts.find(a => a.id === id)?.balance || 0;

  const assets = accounts.filter(a => a.category === AccountCategory.Asset);
  const liabilities = accounts.filter(a => a.category === AccountCategory.Liability);
  const equity = accounts.filter(a => a.category === AccountCategory.Equity);
  
  const revenues = accounts.filter(a => a.category === AccountCategory.Revenue);
  const expenses = accounts.filter(a => a.category === AccountCategory.Expense);

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
  
  const totalRevenue = revenues.reduce((sum, a) => sum + a.balance, 0);
  const totalExpense = expenses.reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenue - totalExpense;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* DRE Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Demonstração de Resultado (DRE)</h3>
            <span className="text-[10px] bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-black">PERÍODO ATUAL</span>
        </div>
        <div className="p-6 space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">(+) Receita Bruta de Vendas</span>
                <span className="font-mono font-bold text-emerald-600">R$ {totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">(-) Custo das Mercadorias Vendidas (CMV)</span>
                <span className="font-mono font-bold text-red-500">R$ {totalExpense.toFixed(2)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between">
                <span className="font-bold text-slate-800">(=) LUCRO / PREJUÍZO LÍQUIDO</span>
                <span className={`font-mono font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    R$ {netProfit.toFixed(2)}
                </span>
            </div>
        </div>
      </div>

      {/* Balanço Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Balanço Patrimonial</h3>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-100">
            {/* Ativos */}
            <div className="p-4 space-y-4">
                <h4 className="text-[10px] font-black text-blue-600 uppercase mb-2">Ativos (Aplicações)</h4>
                <div className="space-y-2">
                    {assets.map(a => (
                        <div key={a.id} className="flex justify-between text-xs">
                            <span className="text-slate-500">{a.name}</span>
                            <span className="font-mono text-slate-700">R$ {a.balance.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="pt-2 border-t border-slate-50 flex justify-between font-bold text-blue-700 text-sm">
                    <span>Total Ativos</span>
                    <span>R$ {totalAssets.toFixed(2)}</span>
                </div>
            </div>
            {/* Passivos + PL */}
            <div className="p-4 space-y-4">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase mb-2">Passivo + PL (Origens)</h4>
                <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Passivo</p>
                    {liabilities.map(a => (
                        <div key={a.id} className="flex justify-between text-xs">
                            <span className="text-slate-500">{a.name}</span>
                            <span className="font-mono text-slate-700">R$ {a.balance.toFixed(2)}</span>
                        </div>
                    ))}
                    <p className="text-[9px] font-bold text-slate-400 uppercase pt-2">Patrimônio Líquido</p>
                    {equity.map(a => (
                        <div key={a.id} className="flex justify-between text-xs">
                            <span className="text-slate-500">{a.name}</span>
                            <span className="font-mono text-slate-700">R$ {a.balance.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="pt-2 border-t border-slate-50 flex justify-between font-bold text-emerald-700 text-sm">
                    <span>Total P+PL</span>
                    <span>R$ {(totalLiabilities + totalEquity).toFixed(2)}</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
          <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-amber-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
          </div>
          <div>
              <p className="text-xs font-bold text-amber-900 mb-1">Dica Estratégica</p>
              <p className="text-[11px] text-amber-800 leading-tight">Observe que no Módulo 4, seu objetivo é transferir o resultado operacional (DRE) para os Lucros Acumulados no Balanço. Isso consolida sua riqueza!</p>
          </div>
      </div>
    </div>
  );
};

export default FinancialReports;
