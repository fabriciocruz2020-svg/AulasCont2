
import React from 'react';
import { Account, AccountCategory } from '../types';

interface FinancialReportsProps {
  accounts: Account[];
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ accounts }) => {
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* DRE Section */}
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="px-7 py-5 bg-indigo-600 flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Demonstração de Resultado (DRE)</h3>
            <span className="text-[9px] bg-white/20 text-white px-3 py-1 rounded-full font-black border border-white/20 uppercase tracking-widest">Performance</span>
        </div>
        <div className="p-8 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">(+) Receita Operacional Bruta</span>
                <span className="font-mono font-black text-emerald-400 text-lg">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">(-) Custos e Despesas Variáveis</span>
                <span className="font-mono font-black text-rose-400 text-lg">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-4 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="font-black text-white uppercase text-xs tracking-widest block mb-1">(=) LUCRO / PREJUÍZO LÍQUIDO</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Resultado do Exercício</span>
                </div>
                <span className={`font-mono text-3xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>
      </div>

      {/* Balanço Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-7 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Balanço Patrimonial Consolidado</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Ativos */}
            <div className="p-6 bg-slate-50/30">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ativos (Bens e Direitos)</h4>
                </div>
                <div className="space-y-3 mb-8 min-h-[160px]">
                    {assets.map(a => (
                        <div key={a.id} className="flex justify-between items-center text-xs p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-slate-600 font-bold">{a.name}</span>
                            <span className="font-mono font-black text-slate-800">R$ {a.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-blue-600 rounded-2xl flex justify-between items-center shadow-lg shadow-blue-200">
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Total Ativo</span>
                    <span className="text-lg font-mono font-black text-white">R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
            {/* Passivos + PL */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Passivo + PL (Origens)</h4>
                </div>
                <div className="space-y-6 mb-8 min-h-[160px]">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Exigibilidade (Dívidas)</p>
                      <div className="space-y-2">
                        {liabilities.map(a => (
                            <div key={a.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                                <span className="text-slate-500 font-semibold">{a.name}</span>
                                <span className="font-mono font-bold text-slate-700">R$ {a.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Patrimônio Líquido (Sócios)</p>
                      <div className="space-y-2">
                        {equity.map(a => (
                            <div key={a.id} className="flex justify-between items-center text-xs p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                <span className="text-indigo-600 font-bold">{a.name}</span>
                                <span className="font-mono font-black text-indigo-900">R$ {a.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                </div>
                <div className="p-4 bg-emerald-600 rounded-2xl flex justify-between items-center shadow-lg shadow-emerald-200">
                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Total P + PL</span>
                    <span className="text-lg font-mono font-black text-white">R$ {(totalLiabilities + totalEquity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="p-6 bg-indigo-900 rounded-3xl border border-indigo-500/30 flex gap-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-indigo-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
              <p className="text-sm font-black text-white mb-2 uppercase tracking-widest">Análise de Sustentabilidade</p>
              <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                Observe que no <span className="text-white font-bold">Módulo 4</span>, o seu principal desafio é consolidar o lucro líquido e decidir sua destinação. Lembre-se: O lucro na DRE aumenta o seu Patrimônio Líquido via "Lucros Acumulados". Esse é o ciclo vital de uma empresa saudável!
              </p>
          </div>
      </div>
    </div>
  );
};

export default FinancialReports;
