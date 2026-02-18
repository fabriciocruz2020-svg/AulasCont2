
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
        Novo Lançamento
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descrição do Evento</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Compra de mercadoria à vista"
            className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
            required
          />
        </div>

        <div className="space-y-4 mb-6">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-end animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 ml-1">Conta</label>
                <select 
                  value={entry.accountId}
                  onChange={(e) => updateEntry(idx, 'accountId', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold focus:border-indigo-500 focus:bg-white outline-none transition-all"
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
              <div className="w-28">
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 ml-1">Tipo</label>
                <select 
                  value={entry.type}
                  onChange={(e) => updateEntry(idx, 'type', e.target.value)}
                  className={`w-full p-2.5 border-2 rounded-xl text-sm font-black focus:bg-white outline-none transition-all ${entry.type === EntryType.Debit ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-emerald-200 bg-emerald-50 text-emerald-600'}`}
                >
                  <option value={EntryType.Debit}>DÉBITO</option>
                  <option value={EntryType.Credit}>CRÉDITO</option>
                </select>
              </div>
              <div className="w-36">
                <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 ml-1">Valor</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">R$</span>
                  <input 
                    type="number" 
                    value={entry.amount || ''}
                    onChange={(e) => updateEntry(idx, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 pl-8 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-mono font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeEntry(idx)}
                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Remover linha"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 px-5 py-4 bg-slate-100 rounded-2xl border-2 border-slate-200 transition-colors">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Resumo do Lançamento</p>
                <div className="flex gap-4">
                  <p className="text-xs font-bold text-slate-600">D: <span className="text-blue-600 font-mono">R$ {totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                  <p className="text-xs font-bold text-slate-600">C: <span className="text-emerald-600 font-mono">R$ {totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                </div>
            </div>
            {!isBalanced && totalDebits > 0 && (
                <span className="text-[10px] font-black text-red-600 animate-pulse bg-red-100 px-3 py-1.5 rounded-full border border-red-200">
                  DIFERENÇA: R$ {Math.abs(totalDebits - totalCredits).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )}
            {isBalanced && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  BALANÇO OK
                </span>
            )}
        </div>

        <div className="flex gap-3">
            <button 
                type="button"
                onClick={addEntry}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 border-2 border-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                Linha
            </button>
            <button 
                type="button"
                onClick={() => onAudit(entries, description)}
                className="px-6 py-3 border-2 border-indigo-200 bg-indigo-50 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-100 transition-all active:scale-95"
            >
                Auditor IA
            </button>
            <button 
                type="submit"
                disabled={!isBalanced || isSuccess}
                className={`flex-1 py-3 rounded-2xl font-black transition-all relative overflow-hidden active:scale-95 uppercase tracking-widest text-xs shadow-lg ${
                  isSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : isBalanced 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300 shadow-none'
                }`}
            >
                <span className="flex items-center justify-center gap-2">
                    {isSuccess ? 'Lançado com Sucesso!' : 'Confirmar Registro'}
                </span>
            </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
