
import { Account, AccountCategory, TutorialStep, EntryType, SwipeChallenge, Badge, Mission } from './types';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'cash', name: 'Caixa (Dinheiro)', category: AccountCategory.Asset, balance: 0 },
  { id: 'inventory', name: 'Estoque', category: AccountCategory.Asset, balance: 0 },
  { id: 'equipment', name: 'Equipamentos', category: AccountCategory.Asset, balance: 0 },
  { id: 'loans', name: 'Empréstimos', category: AccountCategory.Liability, balance: 0 },
  { id: 'capital', name: 'Capital Social', category: AccountCategory.Equity, balance: 0 },
  { id: 'retained_earnings', name: 'Lucros Acumulados', category: AccountCategory.Equity, balance: 0 },
  { id: 'sales', name: 'Receita de Vendas', category: AccountCategory.Revenue, balance: 0 },
  { id: 'cogs', name: 'Custo da Mercadoria (CMV)', category: AccountCategory.Expense, balance: 0 },
  { id: 'expenses', name: 'Despesas Gerais', category: AccountCategory.Expense, balance: 0 },
];

export const BADGES: Badge[] = [
  { id: 'first_step', name: 'Pioneiro', description: 'Realizou seu primeiro investimento.', icon: '🚀' },
  { id: 'balance_master', name: 'Mestre do Equilíbrio', description: 'Concluiu o Módulo 1 com perfeição.', icon: '⚖️' },
  { id: 'dual_mind', name: 'Mente Dual', description: 'Dominou os conceitos de Débito e Crédito.', icon: '🧠' },
  { id: 'operational_pro', name: 'Analista Operacional', description: 'Entende o ciclo de compra e venda.', icon: '📦' },
  { id: 'magnate', name: 'Magnata Contábil', description: 'Consolidou as demonstrações financeiras.', icon: '💎' },
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Grande Aporte',
    description: 'Tenha mais de R$ 5.000 em Ativos totais.',
    reward: 5,
    check: (state) => state.accounts.filter(a => a.category === AccountCategory.Asset).reduce((s, a) => s + a.balance, 0) >= 5000
  },
  {
    id: 'm2',
    title: 'Lançamento Complexo',
    description: 'Realize um lançamento com 3 ou mais contas envolvidas.',
    reward: 3,
    check: (state) => state.transactions.some(t => t.entries.length >= 3)
  }
];

export const MODULES = [
  { id: 1, title: "O Equilíbrio", description: "Ativo = Passivo + PL", objectives: ["Fundamentos patrimoniais", "Origens e Aplicações"] },
  { id: 2, title: "A Dualidade", description: "Receitas e Despesas", objectives: ["Fluxo de competência", "Resultado operacional"] },
  { id: 3, title: "A Operação", description: "Gestão de Mercadorias", objectives: ["Controle de inventário", "Margem de contribuição"] },
  { id: 4, title: "Demonstrações", description: "Apuração e Fechamento", objectives: ["Encerramento de contas", "Destinação do lucro"] }
];

export const TUTORIAL_STEPS: Record<number, TutorialStep[]> = {
  1: [
    { id: "m1s1", title: "Investimento Inicial", instruction: "Abra a empresa com R$ 1.000 em dinheiro. (D: Caixa | C: Capital Social)", targetDescription: "Caixa = 1000", validate: (accs) => accs.find(a => a.id === 'cash')?.balance === 1000 },
    { id: "m1s2", title: "Empréstimo Bancário", instruction: "Pegue R$ 500 emprestados para capital de giro. (D: Caixa | C: Empréstimos)", targetDescription: "Caixa = 1500", validate: (accs) => accs.find(a => a.id === 'cash')?.balance === 1500 },
    { id: "m1s3", title: "Compra de Máquinas", instruction: "Compre R$ 300 em equipamentos à vista. (D: Equipamentos | C: Caixa)", targetDescription: "Equipamentos = 300", validate: (accs) => accs.find(a => a.id === 'equipment')?.balance === 300 },
    { id: "m1s4", title: "Expansão Financiada", instruction: "Compre mais R$ 400 em equipamentos com novo empréstimo. (D: Equipamentos | C: Empréstimos)", targetDescription: "Equipamentos = 700", validate: (accs) => accs.find(a => a.id === 'equipment')?.balance === 700 },
    { id: "m1s5", title: "Amortização", instruction: "Pague R$ 100 do seu empréstimo. (D: Empréstimos | C: Caixa)", targetDescription: "Empréstimos diminui 100", validate: (accs) => accs.find(a => a.id === 'loans')?.balance === 800 },
    { id: "m1s6", title: "Estoque Inicial", instruction: "Compre R$ 200 de estoque à vista. (D: Estoque | C: Caixa)", targetDescription: "Estoque = 200", validate: (accs) => accs.find(a => a.id === 'inventory')?.balance === 200 },
    { id: "m1s7", title: "Aporte Adicional", instruction: "Sócios investem mais R$ 500 em máquinas. (D: Equipamentos | C: Capital Social)", targetDescription: "Capital Social = 1500", validate: (accs) => accs.find(a => a.id === 'capital')?.balance === 1500 },
    { id: "m1s8", title: "Caixa de Segurança", instruction: "Pegue mais R$ 200 emprestado. (D: Caixa | C: Empréstimos)", targetDescription: "Empréstimos = 1000", validate: (accs) => accs.find(a => a.id === 'loans')?.balance === 1000 },
    { id: "m1s9", title: "Pagamento de Dívida", instruction: "Pague mais R$ 200 do empréstimo. (D: Empréstimos | C: Caixa)", targetDescription: "Empréstimos = 800", validate: (accs) => accs.find(a => a.id === 'loans')?.balance === 800 },
    { id: "m1s10", title: "Estoque a Prazo", instruction: "Compre R$ 150 de estoque financiado. (D: Estoque | C: Empréstimos)", targetDescription: "Ativo Total equilibrado", validate: (accs) => accs.find(a => a.id === 'inventory')?.balance === 350 },
  ],
  2: [
    { id: "m2s1", title: "Prestação de Serviço", instruction: "Receba R$ 300 por um serviço à vista. (D: Caixa | C: Receita)", targetDescription: "Receita = 300", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 300 },
    { id: "m2s2", title: "Conta de Luz", instruction: "Pague R$ 50 de energia elétrica. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 50", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 50 },
    { id: "m2s3", title: "Serviço Recorrente", instruction: "Nova venda de R$ 200. (D: Caixa | C: Receita)", targetDescription: "Receita = 500", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 500 },
    { id: "m2s4", title: "Manutenção", instruction: "Pague R$ 30 de reparos. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 80", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 80 },
    { id: "m2s5", title: "Venda de Consultoria", instruction: "Receba R$ 400 à vista. (D: Caixa | C: Receita)", targetDescription: "Receita = 900", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 900 },
    { id: "m2s6", title: "Marketing", instruction: "Gaste R$ 100 em anúncios. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 180", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 180 },
    { id: "m2s7", title: "Receita Extra", instruction: "Venda por R$ 100. (D: Caixa | C: Receita)", targetDescription: "Receita = 1000", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 1000 },
    { id: "m2s8", title: "Limpeza", instruction: "Pague R$ 20. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 200", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 200 },
    { id: "m2s9", title: "Venda Grande", instruction: "Receba R$ 500. (D: Caixa | C: Receita)", targetDescription: "Receita = 1500", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 1500 },
    { id: "m2s10", title: "Taxa Bancária", instruction: "Pague R$ 10. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 210", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 210 },
  ],
  3: [
    { id: "m3s1", title: "Compra Estratégica", instruction: "Compre R$ 500 em estoque. (D: Estoque | C: Caixa)", targetDescription: "Aumentar Estoque", validate: (accs) => accs.find(a => a.id === 'inventory')?.balance === 850 },
    { id: "m3s2", title: "Primeira Venda de Produto", instruction: "Venda mercadoria por R$ 200. (D: Caixa | C: Receita)", targetDescription: "Receita = 1700", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 1700 },
    { id: "m3s3", title: "Baixa de Estoque", instruction: "O custo do produto vendido foi R$ 100. (D: CMV | C: Estoque)", targetDescription: "Baixar R$ 100 do estoque", validate: (accs) => accs.find(a => a.id === 'cogs')?.balance === 100 },
    { id: "m3s4", title: "Reabastecer", instruction: "Compre mais R$ 300. (D: Estoque | C: Caixa)", targetDescription: "Estoque = 1050", validate: (accs) => accs.find(a => a.id === 'inventory')?.balance === 1050 },
    { id: "m3s5", title: "Venda em Lote", instruction: "Venda por R$ 600. (D: Caixa | C: Receita)", targetDescription: "Receita = 2300", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 2300 },
    { id: "m3s6", title: "Custo do Lote", instruction: "A baixa do estoque foi R$ 300. (D: CMV | C: Estoque)", targetDescription: "CMV = 400", validate: (accs) => accs.find(a => a.id === 'cogs')?.balance === 400 },
    { id: "m3s7", title: "Aluguel Depósito", instruction: "Pague R$ 150. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 360", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 360 },
    { id: "m3s8", title: "Venda Final", instruction: "Venda por R$ 400. (D: Caixa | C: Receita)", targetDescription: "Receita = 2700", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 2700 },
    { id: "m3s9", title: "Custo Final", instruction: "Baixa de R$ 200. (D: CMV | C: Estoque)", targetDescription: "CMV = 600", validate: (accs) => accs.find(a => a.id === 'cogs')?.balance === 600 },
    { id: "m3s10", title: "Frete sobre Vendas", instruction: "Pague R$ 40 de frete. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesas = 400", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 400 },
  ],
  4: [
    { id: "m4s1", title: "Encerramento: Receitas", instruction: "Transfira o saldo total de Receitas (R$ 2700) para Lucros Acumulados. (D: Receitas | C: Lucros Acumulados)", targetDescription: "Zerar conta de resultado", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 0 },
    { id: "m4s2", title: "Encerramento: Custos", instruction: "Transfira o saldo de CMV (R$ 600) para Lucros Acumulados. (D: Lucros Acumulados | C: CMV)", targetDescription: "Transferir aplicação de custo", validate: (accs) => accs.find(a => a.id === 'cogs')?.balance === 0 },
    { id: "m4s3", title: "Encerramento: Despesas", instruction: "Transfira o saldo de Despesas (R$ 400) para Lucros Acumulados. (D: Lucros Acumulados | C: Despesas Gerais)", targetDescription: "Zerar despesas operacionais", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 0 },
    { id: "m4s4", title: "Distribuição de Lucro", instruction: "Pague R$ 500 de dividendos aos sócios. (D: Lucros Acumulados | C: Caixa)", targetDescription: "Reduzir PL e Caixa", validate: (accs) => accs.find(a => a.id === 'retained_earnings')?.balance === 1200 },
    { id: "m4s5", title: "Reserva Legal", instruction: "Transfira R$ 200 do Lucro para Capital Social como reserva. (D: Lucros Acumulados | C: Capital Social)", targetDescription: "Blindagem do patrimônio", validate: (accs) => accs.find(a => a.id === 'capital')?.balance === 1700 },
    { id: "m4s6", title: "Novo Ciclo: Atacado", instruction: "Venda R$ 1.000 de mercadorias. (D: Caixa | C: Receitas)", targetDescription: "Retorno da operação", validate: (accs) => accs.find(a => a.id === 'sales')?.balance === 1000 },
    { id: "m4s7", title: "Novo Ciclo: Reposição", instruction: "Baixe R$ 400 de estoque pelo custo da venda. (D: CMV | C: Estoque)", targetDescription: "Gestão de margem", validate: (accs) => accs.find(a => a.id === 'cogs')?.balance === 400 },
    { id: "m4s8", title: "Manutenção Preventiva", instruction: "Pague R$ 100 de manutenção. (D: Despesas Gerais | C: Caixa)", targetDescription: "Despesa fixa", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 100 },
    { id: "m4s9", title: "Amortização de Juros", instruction: "Pague R$ 50 de juros do empréstimo. (D: Despesas Gerais | C: Caixa)", targetDescription: "Custo financeiro", validate: (accs) => accs.find(a => a.id === 'expenses')?.balance === 150 },
    { id: "m4s10", title: "Independência Financeira", instruction: "Aumente seu capital social em mais R$ 500 com lucro. (D: Lucros Acumulados | C: Capital Social)", targetDescription: "Dominou a contabilidade!", validate: (accs) => accs.find(a => a.id === 'capital')?.balance === 2200 },
  ]
};

export const SWIPE_CHALLENGES_M2: SwipeChallenge[] = [
  { id: 's1', scenario: "Recebimento de vendas.", accountName: "CAIXA", correctSide: EntryType.Debit, explanation: "Entrada de dinheiro (Ativo) é DÉBITO." },
  { id: 's2', scenario: "Pagamento de conta de luz.", accountName: "CAIXA", correctSide: EntryType.Credit, explanation: "Saída de dinheiro (Ativo) é CRÉDITO." },
  { id: 's3', scenario: "Contratação de empréstimo.", accountName: "EMPRÉSTIMOS", correctSide: EntryType.Credit, explanation: "Aumento de dívida (Passivo) é CRÉDITO." },
  { id: 's4', scenario: "Compra de estoque à vista.", accountName: "ESTOQUE", correctSide: EntryType.Debit, explanation: "Entrada de mercadoria (Ativo) é DÉBITO." },
  { id: 's5', scenario: "Pagamento de salário.", accountName: "CAIXA", correctSide: EntryType.Credit, explanation: "Saída de caixa é CRÉDITO." }
];
