
export enum AccountCategory {
  Asset = 'Asset',         // Ativo
  Liability = 'Liability', // Passivo
  Equity = 'Equity',       // Patrimônio Líquido
  Revenue = 'Revenue',     // Receita
  Expense = 'Expense'      // Despesa
}

export enum EntryType {
  Debit = 'Debit',
  Credit = 'Credit'
}

export interface Account {
  id: string;
  name: string;
  category: AccountCategory;
  balance: number;
}

export interface JournalEntry {
  accountId: string;
  amount: number;
  type: EntryType;
}

export interface Transaction {
  id: string;
  description: string;
  date: Date;
  entries: JournalEntry[];
  isCorrect?: boolean; // Para modo prática
  timeTaken?: number;  // Segundos
}

export interface TutorialStep {
  id: string;
  title: string;
  instruction: string;
  targetDescription: string;
  validate: (accounts: Account[], lastTransaction: Transaction | null) => boolean;
}

export interface SwipeChallenge {
  id: string;
  scenario: string;
  accountName: string;
  correctSide: EntryType;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  check: (state: GameState) => boolean;
}

export interface GameState {
  module: number;
  tutorialStepIndex: number;
  module2ChallengeIndex: number;
  accounts: Account[];
  transactions: Transaction[];
  money: number;
  tutorialCompleted: Record<number, boolean>;
  isTutorialMode: boolean;
  isPracticeMode: boolean;
  score: number;
  badges: string[]; 
  completedMissions: string[];
}
