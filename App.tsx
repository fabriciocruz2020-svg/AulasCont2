
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Account, Transaction, JournalEntry, EntryType, AccountCategory, TutorialStep, Badge, Mission, SwipeChallenge } from './types';
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
    isPracticeMode: false,
    score: 0,
    badges: [],
    completedMissions: [],
  });

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<string | null>(null);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);
  const [transactionStartTime, setTransactionStartTime] = useState(Date.now());

  const currentTutorialSteps = useMemo(() => TUTORIAL_STEPS[gameState.module] || [], [gameState.module]);
  const currentStep = useMemo(() => currentTutorialSteps[gameState.tutorialStepIndex], [currentTutorialSteps, gameState.tutorialStepIndex]);

  const unlockBadge = useCallback((badgeId: string) => {
    setGameState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) setActiveBadge(badge);
      return { ...prev, badges: [...prev.badges, badgeId], score: prev.score + 5 };
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

  const handleAuditRequest = async (entries: JournalEntry[], description: string, errorHint?: string) => {
    setAuditLoading(true);
    setAuditFeedback(null);
    try {
        const response = await getAIAudit({ entries, description }, gameState.accounts, errorHint);
        setAuditFeedback(response || "O auditor está sem palavras.");
    } catch (e) {
        setAuditFeedback("Falha na conexão com o auditor central.");
    } finally {
        setAuditLoading(false);
    }
  };

  const handleTransaction = useCallback((entries: JournalEntry[], description: string) => {
    const totalDebits = entries.filter(e => e.type === EntryType.Debit).reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = entries.filter(e => e.type === EntryType.Credit).reduce((sum, e) => sum + e.amount, 0);

    if (totalDebits !== totalCredits) {
      alert("Erro: A balança dos lançamentos deve estar equilibrada!");
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

    const timeTaken = (Date.now() - transactionStartTime) / 1000;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      date: new Date(),
      entries: [...entries],
      timeTaken
    };

    let nextStepIndex = gameState.tutorialStepIndex;
    let isModeTutorial = gameState.isTutorialMode;
    let moduleJustFinished = false;
    let addedScore = 0; 

    if (gameState.isPracticeMode) {
        const basePoints = 2;
        const speedBonus = timeTaken < 15 ? 1 : 0;
        addedScore = basePoints + speedBonus;
    } else if (isModeTutorial && currentStep) {
      if (currentStep.validate(newAccounts, newTransaction)) {
        nextStepIndex += 1;
        addedScore = 1;
        
        if (currentStep.id === 'm1s1') setTimeout(() => unlockBadge('first_step'), 500);

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
      if (moduleJustFinished) newState.tutorialCompleted = { ...prev.tutorialCompleted, [prev.module]: true };
      return newState;
    });

    setTransactionStartTime(Date.now());
    if (moduleJustFinished) setShowCompletionOverlay(true);
  }, [gameState, currentStep, currentTutorialSteps, unlockBadge, transactionStartTime]);

  const handleSwipeCorrect = () => {
    const nextChallenge = gameState.module2ChallengeIndex + 1;
    const addedScore = 1;
    
    setGameState(prev => {
      let isTutorialMode = prev.isTutorialMode;
      let moduleJustFinished = false;

      if (nextChallenge >= SWIPE_CHALLENGES_M2.length) {
        // Swipe part finished, but tutorial step part in Module 2 might still be needed or mark complete
        // In our current setup, Module 2 swipe is a phase.
        isTutorialMode = true; // Return to tutorial steps if any
      }

      const newState = { 
        ...prev, 
        module2ChallengeIndex: nextChallenge,
        isTutorialMode,
        score: prev.score + addedScore
      };

      // Check if Module 2 fully complete (Swipe + Tutorial steps)
      // For simplicity, if swipe finishes, we consider a phase complete
      return newState;
    });
  };

  const handleSwipeIncorrect = (explanation: string, challenge: SwipeChallenge) => {
    // Call AI auditor with specific context of the swipe error
    const pseudoEntry: JournalEntry[] = [{
      accountId: challenge.accountName, // Simplified
      amount: 100,
      type: challenge.correctSide === EntryType.Debit ? EntryType.Credit : EntryType.Debit
    }];
    handleAuditRequest(pseudoEntry, `Desafio de Dualidade: ${challenge.scenario}`, `O usuário classificou ${challenge.accountName} incorretamente. ${explanation}`);
  };

  const handleModuleChange = (modId: number) => {
    const isUnlocked = modId === 1 || gameState.tutorialCompleted[modId - 1];
    if (!isUnlocked) return;
    setGameState(prev => ({
      ...prev,
      module: modId,
      tutorialStepIndex: 0,
      isTutorialMode: !prev.tutorialCompleted[modId],
      isPracticeMode: false,
      module2ChallengeIndex: 0
    }));
  };

  const togglePracticeMode = () => {
    setGameState(prev => ({ ...prev, isPracticeMode: !prev.isPracticeMode, isTutorialMode: false }));
    setTransactionStartTime(Date.now());
  };

  const currentModuleData = MODULES.find(m => m.id === gameState.module);
  const isSwipePhase = gameState.module === 2 && gameState.module2ChallengeIndex < SWIPE_CHALLENGES_M2.length && !gameState.isPracticeMode;

  return (
    <div className="min-h-screen gradient-bg text-slate-900 pb-20">
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">A</div>
          <div>
            <h1 className="text-white font-bold leading-none">Axioma</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Accounting Simulator</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
              onClick={togglePracticeMode}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${gameState.isPracticeMode ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20'}`}
            >
              {gameState.isPracticeMode ? 'Modo Prática Ativo' : 'Entrar Modo Livre'}
            </button>
            <button onClick={() => setIsGamificationOpen(true)} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all">
              <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-amber-400">Score</span>
                  <span className="text-white text-sm font-mono font-bold leading-none">{gameState.score} PTS</span>
              </div>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-lg">🏆</div>
            </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {isSwipePhase ? (
          <div className="flex flex-col items-center">
             <CardSwipeGame 
                challenges={SWIPE_CHALLENGES_M2} 
                currentIndex={gameState.module2ChallengeIndex} 
                onCorrect={handleSwipeCorrect} 
                onIncorrect={handleSwipeIncorrect} 
             />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-8">
                {gameState.isTutorialMode && currentStep && !gameState.isPracticeMode ? (
                  <TutorialGuide step={currentStep} currentStepIndex={gameState.tutorialStepIndex} totalSteps={currentTutorialSteps.length} />
                ) : gameState.isPracticeMode ? (
                  <div className="bg-emerald-900 text-white p-7 rounded-3xl shadow-2xl border-2 border-emerald-500/40 animate-in zoom-in duration-500">
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Arena de Prática</h3>
                    <p className="text-emerald-100 text-sm mb-4">Realize transações livremente. Lançamentos rápidos e corretos garantem bônus de pontuação!</p>
                    <div className="flex items-center gap-4 text-[11px] font-bold bg-black/20 p-4 rounded-2xl">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                      <span>Simulador de Mercado Livre Ativo</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-7 rounded-3xl shadow-xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Módulo Master</span>
                          <h2 className="text-xl font-black text-slate-800">{currentModuleData?.title} Concluído</h2>
                      </div>
                      <p className="text-sm text-slate-500 mb-6 font-medium">Você dominou a teoria. Continue praticando no Modo Livre ou revisite os fundamentos.</p>
                      <div className="grid grid-cols-1 gap-2">
                        {currentModuleData?.objectives.map((obj, i) => (
                           <div key={i} className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                             <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                             {obj}
                           </div>
                        ))}
                      </div>
                  </div>
                )}

                {gameState.module === 4 ? <FinancialReports accounts={gameState.accounts} /> : <BalanceScale accounts={gameState.accounts} />}
            </div>

            <div className="lg:col-span-7 space-y-8">
                <TransactionForm accounts={gameState.accounts} onSubmit={handleTransaction} onAudit={handleAuditRequest} />

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-7 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Diário de Operações</h3>
                        <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Total: {gameState.transactions.length}</div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                        {gameState.transactions.length === 0 ? (
                            <div className="p-16 text-center text-slate-300 italic text-sm font-medium">Os livros estão em branco. Comece a registrar.</div>
                        ) : (
                            gameState.transactions.map((t) => (
                                <div key={t.id} className="p-6 hover:bg-slate-50/80 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                          <h4 className="font-black text-base text-slate-800 group-hover:text-indigo-600 transition-colors">{t.description}</h4>
                                          <div className="flex gap-2 mt-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {t.id}</span>
                                            {t.timeTaken && <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">• {t.timeTaken.toFixed(1)}s de execução</span>}
                                          </div>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500">{t.date.toLocaleTimeString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2 shadow-sm">
                                        {t.entries.map((e, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-3">
                                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[9px] ${e.type === EntryType.Debit ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600 ml-4'}`}>
                                                    {e.type === EntryType.Debit ? 'D' : 'C'}
                                                  </div>
                                                  <span className={`font-bold ${e.type === EntryType.Debit ? 'text-slate-700' : 'text-slate-500'}`}>
                                                    {gameState.accounts.find(a => a.id === e.accountId)?.name}
                                                  </span>
                                                </div>
                                                <span className="font-mono font-black text-slate-900">R$ {e.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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

      <AiAuditorPanel isLoading={auditLoading} feedback={auditFeedback} onClose={() => setAuditFeedback(null)} />

      {showCompletionOverlay && (
        <ModuleCompletionOverlay moduleNumber={gameState.module} onContinue={() => {
            setShowCompletionOverlay(false);
            if (gameState.module < 4) handleModuleChange(gameState.module + 1);
        }} />
      )}

      {activeBadge && <BadgeEarnedToast badge={activeBadge} onClose={() => setActiveBadge(null)} />}
      <GamificationPanel state={gameState} isOpen={isGamificationOpen} onClose={() => setIsGamificationOpen(false)} />

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 p-2.5 rounded-3xl flex gap-2 shadow-2xl z-40 overflow-x-auto max-w-[95vw]">
        {MODULES.map((m) => {
          const isUnlocked = m.id === 1 || gameState.tutorialCompleted[m.id - 1];
          const isActive = gameState.module === m.id && !gameState.isPracticeMode;
          const isDone = gameState.tutorialCompleted[m.id];
          return (
            <button key={m.id} onClick={() => isUnlocked && handleModuleChange(m.id)} disabled={!isUnlocked} className={`px-6 py-3 rounded-2xl text-[11px] font-black transition-all relative flex items-center gap-2 whitespace-nowrap uppercase tracking-widest ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : isUnlocked ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-700 cursor-not-allowed'}`}>
              {!isUnlocked && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
              Módulo {m.id}
              {isDone && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>}
            </button>
          );
        })}
      </nav>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
