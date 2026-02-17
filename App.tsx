
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Account, Transaction, JournalEntry, EntryType, AccountCategory, TutorialStep, Badge, Mission } from './types';
import { INITIAL_ACCOUNTS, MODULES, TUTORIAL_STEPS, SWIPE_CHALLENGES_M2, BADGES, MISSIONS } from './constants';
import BalanceScale from './components/BalanceScale';
import TransactionForm from './components/TransactionForm';
import AiAuditorPanel from './components/AiAuditorPanel';
import TutorialGuide from './components/TutorialGuide';
import CardSwipeGame from './components/CardSwipeGame';
import ModuleCompletionOverlay from './components/ModuleCompletionOverlay';
import FinancialReports from './components/FinancialReports';
import BadgeEarnedToast from './components/BadgeEarnedToast';
import GamificationPanel from './components/GamificationPanel';
import { getAIAudit } from './services/gemini';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    module: 1,
    tutorialStepIndex: 0,
    module2ChallengeIndex: 0,
    accounts: [...INITIAL_ACCOUNTS],
    transactions: [],
    money: 1000,
    tutorialCompleted: { 1: false, 2: false, 3: false, 4: false },
    isTutorialMode: true,
    score: 0,
    badges: [],
    completedMissions: [],
  });

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);

  const currentTutorialSteps = useMemo(() => TUTORIAL_STEPS[gameState.module] || [], [gameState.module]);
  const currentStep = useMemo(() => currentTutorialSteps[gameState.tutorialStepIndex], [currentTutorialSteps, gameState.tutorialStepIndex]);

  const unlockBadge = useCallback((badgeId: string) => {
    setGameState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) setActiveBadge(badge);
      return { ...prev, badges: [...prev.badges, badgeId], score: prev.score + 5 }; // Bônus de badge
    });
  }, []);

  useEffect(() => {
    MISSIONS.forEach(mission => {
      if (!gameState.completedMissions.includes(mission.id) && mission.check(gameState)) {
        setGameState(prev => ({
          ...prev,
          completedMissions: [...prev.completedMissions, mission.id],
          score: prev.score + mission.reward
        }));
      }
    });
  }, [gameState]);

  const handleTransaction = useCallback((entries: JournalEntry[], description: string) => {
    const totalDebits = entries.filter(e => e.type === EntryType.Debit).reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = entries.filter(e => e.type === EntryType.Credit).reduce((sum, e) => sum + e.amount, 0);

    if (totalDebits !== totalCredits) {
      alert("Erro: A balança dos lançamentos deve estar equilibrada (Débito = Crédito)!");
      return;
    }

    const newAccounts = gameState.accounts.map(account => {
      let newBalance = account.balance;
      const relatedEntries = entries.filter(e => e.accountId === account.id);
      
      relatedEntries.forEach(entry => {
        if (account.category === AccountCategory.Asset || account.category === AccountCategory.Expense) {
          if (entry.type === EntryType.Debit) newBalance += entry.amount;
          else newBalance -= entry.amount;
        } else {
          if (entry.type === EntryType.Credit) newBalance += entry.amount;
          else newBalance -= entry.amount;
        }
      });
      return { ...account, balance: newBalance };
    });

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      date: new Date(),
      entries: [...entries]
    };

    let nextStepIndex = gameState.tutorialStepIndex;
    let isModeTutorial = gameState.isTutorialMode;
    let moduleJustFinished = false;
    let addedScore = 0; 

    if (isModeTutorial && currentStep) {
      if (currentStep.validate(newAccounts, newTransaction)) {
        nextStepIndex += 1;
        addedScore = 1; // 1 pt por acerto no tutorial
        
        if (currentStep.id === 'm1s1') {
          setTimeout(() => unlockBadge('first_step'), 500);
        }

        if (nextStepIndex >= currentTutorialSteps.length) {
          isModeTutorial = false;
          moduleJustFinished = true;
          
          if (gameState.module === 1) setTimeout(() => unlockBadge('balance_master'), 500);
          if (gameState.module === 2) setTimeout(() => unlockBadge('dual_mind'), 500);
          if (gameState.module === 3) setTimeout(() => unlockBadge('operational_pro'), 500);
          if (gameState.module === 4) setTimeout(() => unlockBadge('magnate'), 500);
        }
      } else {
        handleAuditRequest(entries, `Tutorial Erro: ${currentStep.targetDescription}`);
        return;
      }
    }

    setGameState(prev => {
      const newState = {
        ...prev,
        accounts: newAccounts,
        transactions: [newTransaction, ...prev.transactions],
        tutorialStepIndex: nextStepIndex,
        isTutorialMode: isModeTutorial,
        score: prev.score + addedScore
      };
      
      if (moduleJustFinished) {
        newState.tutorialCompleted = { ...prev.tutorialCompleted, [prev.module]: true };
      }
      
      return newState;
    });

    if (moduleJustFinished) {
      setShowCompletionOverlay(true);
    }
  }, [gameState, currentStep, currentTutorialSteps, unlockBadge]);

  const handleAuditRequest = async (entries: JournalEntry[], description: string) => {
    setAuditLoading(true);
    setAuditFeedback(null);
    try {
        const response = await getAIAudit({ entries, description }, gameState.accounts);
        setAuditFeedback(response || "O auditor está sem palavras.");
    } catch (e) {
        setAuditFeedback("Falha na conexão com o auditor central.");
    } finally {
        setAuditLoading(false);
    }
  };

  const handleSwipeCorrect = () => {
    const nextChallenge = gameState.module2ChallengeIndex + 1;
    const addedScore = 1; // 1 pt por acerto no swipe
    
    if (nextChallenge >= SWIPE_CHALLENGES_M2.length) {
      setGameState(prev => ({ 
        ...prev, 
        module2ChallengeIndex: nextChallenge,
        isTutorialMode: true,
        tutorialStepIndex: 0,
        score: prev.score + addedScore
      }));
    } else {
      setGameState(prev => ({ 
        ...prev, 
        module2ChallengeIndex: nextChallenge,
        score: prev.score + addedScore
      }));
    }
  };

  const handleModuleChange = (modId: number) => {
    const isUnlocked = modId === 1 || gameState.tutorialCompleted[modId - 1];
    if (!isUnlocked) return;

    setGameState(prev => ({
      ...prev,
      module: modId,
      tutorialStepIndex: 0,
      isTutorialMode: !prev.tutorialCompleted[modId],
      module2ChallengeIndex: modId === 2 && !prev.tutorialCompleted[2] ? 0 : prev.module2ChallengeIndex
    }));
  };

  const currentModuleData = MODULES.find(m => m.id === gameState.module);
  const isSwipePhase = gameState.module === 2 && gameState.module2ChallengeIndex < SWIPE_CHALLENGES_M2.length;

  return (
    <div className="min-h-screen gradient-bg text-slate-900 pb-20">
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div>
            <h1 className="text-white font-bold leading-none">Axioma</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Accounting Simulator</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsGamificationOpen(true)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all"
            >
              <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-amber-400">Score</span>
                  <span className="text-white text-sm font-mono font-bold leading-none">{gameState.score} PTS</span>
              </div>
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-lg">🏆</div>
            </button>

            <div className="hidden md:flex gap-4">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Progresso</span>
                    <span className="text-white text-xs font-semibold">{currentModuleData?.title}</span>
                </div>
                <div className="bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-xl flex flex-col items-end">
                    <span className="text-[9px] uppercase font-bold text-indigo-300">Patrimônio Líquido</span>
                    <span className="text-indigo-100 text-xs font-bold">
                        R$ {((gameState.accounts.find(a => a.id === 'capital')?.balance || 0) + (gameState.accounts.find(a => a.id === 'retained_earnings')?.balance || 0)).toLocaleString('pt-BR')}
                    </span>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {isSwipePhase ? (
          <div className="flex flex-col items-center">
             <CardSwipeGame 
              challenges={SWIPE_CHALLENGES_M2} 
              currentIndex={gameState.module2ChallengeIndex}
              onCorrect={handleSwipeCorrect}
              onIncorrect={(f) => setAuditFeedback(f)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-8">
                {gameState.isTutorialMode && currentStep ? (
                  <TutorialGuide 
                    step={currentStep} 
                    currentStepIndex={gameState.tutorialStepIndex}
                    totalSteps={currentTutorialSteps.length}
                  />
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex items-center gap-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase">Módulo Concluído</span>
                          <h2 className="text-xl font-bold text-slate-800">{currentModuleData?.description}</h2>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Você dominou os 10 passos deste módulo. Siga em frente!</p>
                      <div className="space-y-2">
                        {currentModuleData?.objectives.map((obj, i) => (
                           <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                             <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                             {obj}
                           </div>
                        ))}
                      </div>
                  </div>
                )}

                {gameState.module === 4 ? (
                    <FinancialReports accounts={gameState.accounts} />
                ) : (
                    <BalanceScale accounts={gameState.accounts} />
                )}
            </div>

            <div className="lg:col-span-7 space-y-8">
                <TransactionForm 
                    accounts={gameState.accounts} 
                    onSubmit={handleTransaction}
                    onAudit={handleAuditRequest}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Livro Diário</h3>
                        <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">Registros: {gameState.transactions.length}</div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {gameState.transactions.length === 0 ? (
                            <div className="p-12 text-center text-slate-300 italic text-sm">Nenhum evento registrado ainda.</div>
                        ) : (
                            gameState.transactions.map((t) => (
                                <div key={t.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm text-slate-700">{t.description}</h4>
                                        <span className="text-[10px] font-bold text-slate-400">{t.date.toLocaleTimeString()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {t.entries.map((e, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className={`flex items-center gap-2 ${e.type === EntryType.Debit ? 'text-blue-500 font-medium' : 'pl-6 text-emerald-500'}`}>
                                                    <span className="text-[9px] font-black w-4">{e.type === EntryType.Debit ? 'D' : 'C'}</span>
                                                    {gameState.accounts.find(a => a.id === e.accountId)?.name}
                                                </span>
                                                <span className="font-mono text-slate-600">R$ {e.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>

      <AiAuditorPanel 
        isLoading={auditLoading} 
        feedback={auditFeedback} 
        onClose={() => setAuditFeedback(null)} 
      />

      {showCompletionOverlay && (
        <ModuleCompletionOverlay 
          moduleNumber={gameState.module} 
          onContinue={() => {
            setShowCompletionOverlay(false);
            if (gameState.module < 4) {
              handleModuleChange(gameState.module + 1);
            }
          }} 
        />
      )}

      {activeBadge && (
        <BadgeEarnedToast 
          badge={activeBadge} 
          onClose={() => setActiveBadge(null)} 
        />
      )}

      <GamificationPanel 
        state={gameState} 
        isOpen={isGamificationOpen} 
        onClose={() => setIsGamificationOpen(false)} 
      />

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex gap-2 shadow-2xl z-40 overflow-x-auto max-w-[95vw]">
        {MODULES.map((m) => {
          const isUnlocked = m.id === 1 || gameState.tutorialCompleted[m.id - 1];
          const isActive = gameState.module === m.id;
          const isDone = gameState.tutorialCompleted[m.id];
          
          return (
            <button 
              key={m.id}
              onClick={() => isUnlocked && handleModuleChange(m.id)}
              disabled={!isUnlocked}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : isUnlocked 
                    ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                    : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {!isUnlocked && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              )}
              Módulo {m.id}
              {isDone && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default App;
