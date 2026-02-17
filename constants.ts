
import { Account, AccountCategory, TutorialStep, EntryType, SwipeChallenge, Badge, Mission, GameState } from './types';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'cash', name: 'Caixa (Dinheiro)', category: AccountCategory.Asset, balance: 0 },
  { id: 'inventory', name: 'Estoque', category: AccountCategory.Asset, balance: 0 },
  { id: 'equipment', name: 'Equipamentos', category: AccountCategory.Asset, balance: 0 },
  { id: 'loans', name: 'Empréstimos', category: AccountCategory.Liability, balance: 0 },
  { id: 'capital', name: 'Capital Social', category: AccountCategory.Equity, balance: 0 },
  { id: 'retained_earnings', name: 'Lucros Acumulados', category: AccountCategory.Equity, balance: 0 },
  { id: 'sales', name: 'Receita de Vendas', category: AccountCategory.Revenue, balance: 0 },
  { id: 'cogs', name: 'Custo da Mercadoria', category: AccountCategory.Expense, balance: 0 },
];

export const BADGES: Badge[] = [
  { id: 'first_step', name: 'Pioneiro', description: 'Realizou seu primeiro investimento.', icon: '🚀' },
  { id: 'balance_master', name: 'Mestre do Equilíbrio', description: 'Concluiu o Módulo 1 sem desequilibrar a balança.', icon: '⚖️' },
  { id: 'dual_mind', name: 'Mente Dual', description: 'Dominou os conceitos de Débito e Crédito.', icon: '🧠' },
  { id: 'operational_pro', name: 'Analista Operacional', description: 'Entende o ciclo de compra e venda.', icon: '📦' },
  { id: 'magnate', name: 'Magnata Contábil', description: 'Consolidou seu primeiro lucro nas demonstrações.', icon: '💎' },
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Grande Aporte',
    description: 'Tenha mais de R$ 5.000 em Ativos totais.',
    reward: 500,
    check: (state) => state.accounts.filter(a => a.category === AccountCategory.Asset).reduce((s, a) => s + a.balance, 0) >= 5000
  },
  {
    id: 'm2',
    title: 'Lançamento Complexo',
    description: 'Realize um lançamento com 3 ou mais contas envolvidas.',
    reward: 300,
    check: (state) => state.transactions.some(t => t.entries.length >= 3)
  },
  {
    id: 'm3',
    title: 'Historiador',
    description: 'Registre pelo menos 5 transações no Livro Diário.',
    reward: 200,
    check: (state) => state.transactions.length >= 5
  },
  {
    id: 'm4',
    title: 'Sem Dívidas',
    description: 'Zere o saldo da conta de Empréstimos.',
    reward: 400,
    check: (state) => {
      const loan = state.accounts.find(a => a.id === 'loans');
      return !!loan && loan.balance === 0 && state.transactions.some(t => t.entries.some(e => e.accountId === 'loans'));
    }
  }
];

export const MODULES = [
  {
    id: 1,
    title: "O Equilíbrio",
    description: "A Equação Fundamental: Ativo = Passivo + PL",
    objectives: ["Entender origens e aplicações", "Equilibrar a balança patrimonial"]
  },
  {
    id: 2,
    title: "A Dualidade",
    description: "Débitos e Créditos: O Fluxo de Energia",
    objectives: ["Identificar onde o valor entra (Aplicação) e sai (Origem)", "Lançar vendas e recebimentos"]
  },
  {
    id: 3,
    title: "A Operação",
    description: "Ciclo Operacional: Da Compra à Venda",
    objectives: ["Gerenciar estoque e custos", "Entender o impacto no lucro"]
  },
  {
    id: 4,
    title: "Demonstrações",
    description: "Relatórios: DRE e Balanço Patrimonial",
    objectives: ["Interpretar a saúde financeira", "Diferenciar Lucro de Caixa", "Tomar decisões estratégicas"]
  }
];

export const TUTORIAL_STEPS: Record<number, TutorialStep[]> = {
  1: [
    {
      id: "m1s1",
      title: "Investimento Inicial",
      instruction: "Toda empresa nasce de um investimento. Coloque R$ 1.000 no Caixa usando o Capital Social como origem. (Débito: Caixa | Crédito: Capital Social)",
      targetDescription: "Aumentar Caixa e Capital Social em R$ 1.000",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'cash')?.balance === 1000) && 
        (accounts.find(a => a.id === 'capital')?.balance === 1000)
    },
    {
      id: "m1s2",
      title: "Financiamento Externo",
      instruction: "Agora, pegue R$ 500 emprestado no banco para ter mais fôlego. (Débito: Caixa | Crédito: Empréstimos)",
      targetDescription: "Caixa deve ir para R$ 1.500 e Empréstimos para R$ 500",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'cash')?.balance === 1500) && 
        (accounts.find(a => a.id === 'loans')?.balance === 500)
    }
  ],
  2: [
    {
      id: "m2s1",
      title: "A Venda à Vista",
      instruction: "Vendemos um serviço por R$ 300 à vista. O dinheiro ENTRA no caixa e a origem é uma RECEITA. (Débito: Caixa | Crédito: Receita de Vendas)",
      targetDescription: "Aumentar Caixa e Receita de Vendas em R$ 300",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'cash')?.balance === 1800) && 
        (accounts.find(a => a.id === 'sales')?.balance === 300)
    }
  ],
  3: [
    {
      id: "m3s1",
      title: "Abastecendo o Estoque",
      instruction: "Para vender, precisamos de produtos. Compre R$ 200 em mercadorias usando o dinheiro do caixa. (Débito: Estoque | Crédito: Caixa)",
      targetDescription: "Retirar R$ 200 do Caixa e colocar no Estoque",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'inventory')?.balance === 200) && 
        (accounts.find(a => a.id === 'cash')?.balance === 1600)
    },
    {
      id: "m3s2",
      title: "O Custo da Venda",
      instruction: "Vendemos todo o estoque! Primeiro, registre a saída do estoque para a conta de Custo (CMV). (Débito: Custo da Mercadoria | Crédito: Estoque)",
      targetDescription: "Zerar estoque e aumentar Custo em R$ 200",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'inventory')?.balance === 0) && 
        (accounts.find(a => a.id === 'cogs')?.balance === 200)
    }
  ],
  4: [
    {
      id: "m4s1",
      title: "Apuração do Resultado",
      instruction: "No final do período, transferimos o lucro para o Patrimônio Líquido. Transfira o saldo da Receita (R$ 300) para Lucros Acumulados. (Débito: Receita de Vendas | Crédito: Lucros Acumulados)",
      targetDescription: "Zerar Receita e mover R$ 300 para Lucros Acumulados",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'sales')?.balance === 0) && 
        (accounts.find(a => a.id === 'retained_earnings')?.balance === 300)
    },
    {
      id: "m4s2",
      title: "Deduzindo o Custo",
      instruction: "Agora, transfira o Custo (R$ 200) para Lucros Acumulados para encontrar o lucro líquido. (Débito: Lucros Acumulados | Crédito: Custo da Mercadoria)",
      targetDescription: "Zerar Custo e atualizar Lucros Acumulados para R$ 100",
      validate: (accounts) => 
        (accounts.find(a => a.id === 'cogs')?.balance === 0) && 
        (accounts.find(a => a.id === 'retained_earnings')?.balance === 100)
    }
  ]
};

export const SWIPE_CHALLENGES_M2: SwipeChallenge[] = [
  {
    id: 's1',
    scenario: "Venda de produto com recebimento imediato.",
    accountName: "CAIXA",
    correctSide: EntryType.Debit,
    explanation: "Entrada de recurso em Ativo é DÉBITO."
  },
  {
    id: 's2',
    scenario: "Pagamento de fornecedores em dinheiro.",
    accountName: "CAIXA",
    correctSide: EntryType.Credit,
    explanation: "Saída de recurso em Ativo é CRÉDITO."
  },
  {
    id: 's3',
    scenario: "Obtenção de novo financiamento.",
    accountName: "EMPRÉSTIMOS",
    correctSide: EntryType.Credit,
    explanation: "Aumento de obrigação (Passivo) é CRÉDITO."
  }
];
