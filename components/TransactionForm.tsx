
import React, { useState } from 'react';
import { Account, EntryType, JournalEntry } from '../types';

interface TransactionFormProps {
  accounts: Account[];
  onSubmit: (entries: JournalEntry[], description: string) => void;
  onAudit: (entries: JournalEntry[], description: string) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, onSubmit, onAudit }) => {
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([
    { accountId: accounts[0].id, amount: 0, type: EntryType.Debit },
    { accountId: accounts[1].id, amount: 0, type: EntryType.Credit },
  ]);

  const addEntry = () => {
    setEntries([...entries, { accountId: accounts[0].id, amount: 0, type: EntryType.Debit }]);
  };

  const updateEntry = (index: number, field: keyof JournalEntry, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 2) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(entries, description);
    setIsSuccess(true);
    setDescription('');
    setEntries([
        { accountId: accounts[0].id, amount: 0, type: EntryType.Debit },
        { accountId: accounts[1].id, amount: 0, type: EntryType.Credit },
    ]);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const totalDebits = entries.filter(e => e.type === EntryType.Debit).reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = entries.filter(e => e.type === EntryType.Credit).reduce((sum, e) => sum + e.amount, 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  return (
    <div className="bg-white p-7 rounded-3xl shadow-xl border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
          Registrar Lançamento
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Manual de Partidas Dobradas
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Descrição do Evento Econômico</label>
          <div className="relative group">
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aquisição de estoque para revenda"
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-700"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-3 items-end animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex-1">
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-2 ml-1">Conta Contábil</label>
                <select 
                  value={entry.accountId}
                  onChange={(e) => updateEntry(idx, 'accountId', e.target.value)}
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all shadow-sm"
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
              <div className="w-32 group relative">
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-2 ml-1">Natureza</label>
                <select 
                  value={entry.type}
                  onChange={(e) => updateEntry(idx, 'type', e.target.value)}
                  className={`w-full p-3 border-2 rounded-2xl text-xs font-black outline-none transition-all shadow-sm cursor-help ${entry.type === EntryType.Debit ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}
                >
                  <option value={EntryType.Debit}>DÉBITO (D)</option>
                  <option value={EntryType.Credit}>CRÉDITO (C)</option>
                </select>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                  {entry.type === EntryType.Debit 
                    ? "DÉBITO representa uma APLICAÇÃO de recurso (onde o valor foi parar)." 
                    : "CRÉDITO representa uma ORIGEM de recurso (de onde o valor veio)."}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                </div>
              </div>
              <div className="w-40">
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-2 ml-1">Valor Monetário</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">R$</span>
                  <input 
                    type="number" 
                    value={entry.amount || ''}
                    onChange={(e) => updateEntry(idx, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 pl-10 bg-white border-2 border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeEntry(idx)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all mb-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8 px-6 py-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner">
            <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verificação de Saldos</p>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-blue-400 font-bold uppercase">Débitos Totais</span>
                    <span className="text-lg font-mono font-black text-white">R$ {totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase">Créditos Totais</span>
                    <span className="text-lg font-mono font-black text-white">R$ {totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
            </div>
            {!isBalanced && totalDebits > 0 && (
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 animate-pulse">
                    EM DESEQUILÍBRIO
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">Dif: R$ {Math.abs(totalDebits - totalCredits).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            )}
            {isBalanced && (
                <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Partida Equilibrada</span>
                </div>
            )}
        </div>

        <div className="flex gap-4">
            <button 
                type="button"
                onClick={addEntry}
                className="px-6 py-4 bg-white text-slate-600 rounded-2xl font-black hover:bg-slate-50 border-2 border-slate-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm text-xs uppercase tracking-widest"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                Nova Conta
            </button>
            <button 
                type="button"
                onClick={() => onAudit(entries, description)}
                className="px-6 py-4 border-2 border-indigo-200 bg-indigo-50 text-indigo-700 rounded-2xl font-black hover:bg-indigo-100 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
                Auditar
            </button>
            <button 
                type="submit"
                disabled={!isBalanced || isSuccess}
                className={`flex-1 py-4 rounded-2xl font-black transition-all relative overflow-hidden active:scale-95 uppercase tracking-widest text-xs shadow-xl group ${
                  isSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/40' 
                    : isBalanced 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300 shadow-none'
                }`}
            >
                {/* Shine effect */}
                {!isSuccess && isBalanced && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                )}
                <span className="flex items-center justify-center gap-3">
                    {isSuccess ? (
                      <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        Sucesso!
                      </div>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                        Confirmar Registro
                      </>
                    )}
                </span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
