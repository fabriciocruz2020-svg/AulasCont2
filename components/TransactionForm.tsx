
import React, { useState, useEffect } from 'react';
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
    
    // Trigger success animation
    setIsSuccess(true);
    
    // Reset form after a brief moment
    setDescription('');
    setEntries([
        { accountId: accounts[0].id, amount: 0, type: EntryType.Debit },
        { accountId: accounts[1].id, amount: 0, type: EntryType.Credit },
    ]);

    // Clear success state after animation duration
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const totalDebits = entries.filter(e => e.type === EntryType.Debit).reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = entries.filter(e => e.type === EntryType.Credit).reduce((sum, e) => sum + e.amount, 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold mb-4 text-slate-800">Novo Lançamento</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-1">Descrição do Evento</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Compra de mercadoria à vista"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-3 mb-6">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-end animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Conta</label>
                <select 
                  value={entry.accountId}
                  onChange={(e) => updateEntry(idx, 'accountId', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tipo</label>
                <select 
                  value={entry.type}
                  onChange={(e) => updateEntry(idx, 'type', e.target.value)}
                  className={`w-full p-2 border rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${entry.type === EntryType.Debit ? 'border-blue-200 text-blue-600' : 'border-emerald-200 text-emerald-600'}`}
                >
                  <option value={EntryType.Debit}>DÉBITO</option>
                  <option value={EntryType.Credit}>CRÉDITO</option>
                </select>
              </div>
              <div className="w-32">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Valor</label>
                <input 
                  type="number" 
                  value={entry.amount || ''}
                  onChange={(e) => updateEntry(idx, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0,00"
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeEntry(idx)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remover linha"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6 px-4 py-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 transition-colors">
            <div className="text-xs text-slate-500">
                <p>Total Débitos: <span className="font-bold text-blue-600">R$ {totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                <p>Total Créditos: <span className="font-bold text-emerald-600">R$ {totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
            </div>
            {!isBalanced && totalDebits > 0 && (
                <span className="text-xs font-bold text-red-500 animate-pulse bg-red-50 px-2 py-1 rounded-full border border-red-100">
                  Desequilíbrio: R$ {Math.abs(totalDebits - totalCredits).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )}
            {isBalanced && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Balanço Ok!
                </span>
            )}
        </div>

        <div className="flex gap-2">
            <button 
                type="button"
                onClick={addEntry}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors active:scale-95"
            >
                + Linha
            </button>
            <button 
                type="button"
                onClick={() => onAudit(entries, description)}
                className="px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors active:scale-95"
            >
                Auditor IA
            </button>
            <button 
                type="submit"
                disabled={!isBalanced || isSuccess}
                className={`flex-1 py-2 rounded-xl font-bold transition-all relative overflow-hidden active:scale-95 ${
                  isSuccess 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105' 
                    : isBalanced 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${isSuccess ? 'translate-y-0' : 'translate-y-0'}`}>
                    {isSuccess ? (
                      <>
                        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        Sucesso!
                      </>
                    ) : (
                      'Confirmar Lançamento'
                    )}
                </span>
                
                {/* Glow effect on success */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none"></div>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
