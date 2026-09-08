import {
  FinancialTransaction,
  TitleReceivable,
  TitlePayable,
  CustomerAdvance,
  FinancialSummaryMetrics,
  CashFlowDataPoint,
  CreateDirectTransactionInput,
  RegisterPaymentInput,
} from '@/types/financial';
import { purchaseService } from './purchase-service';

const TRANSACTIONS_KEY = 'veneza_brownies_fin_transactions_v1';
const RECEIVABLES_KEY = 'veneza_brownies_fin_receivables_v1';
const PAYABLES_KEY = 'veneza_brownies_fin_payables_v1';
const ADVANCES_KEY = 'veneza_brownies_fin_advances_v1';

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    date: '08/09/2026',
    description: 'Venda Balcão Pronta-Entrega #VND-2026-042',
    category: 'Vendas de Balcão',
    type: 'entrada',
    origin: 'venda',
    paymentMethod: 'pix',
    amount: 145.0,
    status: 'confirmado',
    referenceId: 'VND-2026-042',
  },
  {
    id: 'tx-2',
    date: '08/09/2026',
    description: 'Recebimento de Pedido de Encomenda #PED-038',
    category: 'Encomendas & Eventos',
    type: 'entrada',
    origin: 'pagamento_cliente',
    paymentMethod: 'cartao_credito',
    amount: 320.0,
    status: 'confirmado',
    referenceId: 'PED-038',
  },
  {
    id: 'tx-3',
    date: '08/09/2026',
    description: 'Pagamento Harald Chocolates Nobres (Compra #COM-2026-001)',
    category: 'Fornecedores Matéria-Prima',
    type: 'saida',
    origin: 'pagamento_fornecedor',
    paymentMethod: 'pix',
    amount: 2800.0,
    status: 'confirmado',
    referenceId: 'COM-2026-001',
  },
  {
    id: 'tx-4',
    date: '07/09/2026',
    description: 'Adiantamento 50% Pedido Corporativo #PED-041',
    category: 'Adiantamentos de Clientes',
    type: 'entrada',
    origin: 'adiantamento',
    paymentMethod: 'transferencia',
    amount: 250.0,
    status: 'confirmado',
    referenceId: 'PED-041',
  },
  {
    id: 'tx-5',
    date: '06/09/2026',
    description: 'Pagamento Parcial Laticínios Bela Vista (Compra #COM-2026-002)',
    category: 'Fornecedores Laticínios',
    type: 'saida',
    origin: 'pagamento_fornecedor',
    paymentMethod: 'transferencia',
    amount: 730.0,
    status: 'confirmado',
    referenceId: 'COM-2026-002',
  },
  {
    id: 'tx-6',
    date: '05/09/2026',
    description: 'Conta de Energia Elétrica Cozinha/Forno (CPFL)',
    category: 'Custos Operacionais',
    type: 'saida',
    origin: 'despesa',
    paymentMethod: 'boleto',
    amount: 385.4,
    status: 'confirmado',
  },
  {
    id: 'tx-7',
    date: '05/09/2026',
    description: 'Lançamento Direto: Reposição de Gás P45 Industrial',
    category: 'Manutenção & Cozinha',
    type: 'saida',
    origin: 'lancamento_direto',
    paymentMethod: 'pix',
    amount: 420.0,
    status: 'confirmado',
    notes: 'Substituição de botijão P45 para forno de lastro.',
  },
];

export const INITIAL_RECEIVABLES: TitleReceivable[] = [
  {
    id: 'rec-1',
    clientName: 'Carla Silveira Eventos',
    origin: 'Encomenda #PED-039 (100 Brownies Casamento)',
    dueDate: '12/09/2026',
    originalAmount: 1200.0,
    receivedAmount: 600.0,
    balanceDue: 600.0,
    status: 'parcial',
    notes: 'Sinal de 50% já recebido como adiantamento. Saldo na entrega.',
  },
  {
    id: 'rec-2',
    clientName: 'Café & Livraria Dom Pedro',
    origin: 'Faturamento Semanal de Pronta-Entrega',
    dueDate: '15/09/2026',
    originalAmount: 480.0,
    receivedAmount: 0.0,
    balanceDue: 480.0,
    status: 'aberto',
    notes: 'Boleto faturado para 15 dias.',
  },
  {
    id: 'rec-3',
    clientName: 'Escola Aquarela Festas',
    origin: 'Kit Lembrancinhas Dia dos Professores',
    dueDate: '05/09/2026',
    originalAmount: 350.0,
    receivedAmount: 0.0,
    balanceDue: 350.0,
    status: 'vencido',
    notes: 'Atraso de 3 dias. Financeiro em contato com a secretaria.',
  },
];

export const INITIAL_PAYABLES: TitlePayable[] = [
  {
    id: 'pay-1',
    supplierName: 'Laticínios Bela Vista Ltda',
    description: 'Saldo Compra Manteiga #COM-2026-002',
    origin: 'Compra #COM-2026-002',
    dueDate: '21/09/2026',
    originalAmount: 1460.0,
    paidAmount: 730.0,
    balanceDue: 730.0,
    status: 'parcial',
    notes: '2ª parcela com vencimento em 15 dias.',
  },
  {
    id: 'pay-2',
    supplierName: 'Gráfica & Embalagens Premium Kraft',
    description: 'Caixas Presenteáveis e Fitas #COM-2026-003',
    origin: 'Compra #COM-2026-003',
    dueDate: '14/09/2026',
    originalAmount: 480.0,
    paidAmount: 0.0,
    balanceDue: 480.0,
    status: 'aberto',
    notes: 'Boleto bancário Itaú.',
  },
  {
    id: 'pay-3',
    supplierName: 'Manutenção de Equipamentos Gastronômicos',
    description: 'Revisão preventiva das batedeiras planetárias',
    origin: 'Despesa Operacional #OS-88',
    dueDate: '04/09/2026',
    originalAmount: 250.0,
    paidAmount: 0.0,
    balanceDue: 250.0,
    status: 'vencido',
    notes: 'Agendado para quitação hoje via PIX.',
  },
];

export const INITIAL_ADVANCES: CustomerAdvance[] = [
  {
    id: 'adv-1',
    clientName: 'Carla Silveira Eventos',
    date: '01/09/2026',
    receivedAmount: 600.0,
    appliedAmount: 600.0,
    availableBalance: 0.0,
    status: 'utilizado_total',
    notes: 'Aplicado na entrada da Encomenda #PED-039.',
  },
  {
    id: 'adv-2',
    clientName: 'Rodrigo Mendes Advocacia',
    date: '07/09/2026',
    receivedAmount: 250.0,
    appliedAmount: 0.0,
    availableBalance: 250.0,
    status: 'disponivel',
    notes: 'Sinal para Kit Festas de Aniversário agendado para 20/09.',
  },
  {
    id: 'adv-3',
    clientName: 'Empório dos Sabores',
    date: '04/09/2026',
    receivedAmount: 400.0,
    appliedAmount: 180.0,
    availableBalance: 220.0,
    status: 'utilizado_parcial',
    notes: 'Crédito parcial em aberto para próximas entregas de brownies.',
  },
];

class FinancialService {
  private transactions: FinancialTransaction[] = [...INITIAL_TRANSACTIONS];
  private receivables: TitleReceivable[] = [...INITIAL_RECEIVABLES];
  private payables: TitlePayable[] = [...INITIAL_PAYABLES];
  private advances: CustomerAdvance[] = [...INITIAL_ADVANCES];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const rawTx = localStorage.getItem(TRANSACTIONS_KEY);
        if (rawTx) this.transactions = JSON.parse(rawTx);
        else localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));

        const rawRec = localStorage.getItem(RECEIVABLES_KEY);
        if (rawRec) this.receivables = JSON.parse(rawRec);
        else localStorage.setItem(RECEIVABLES_KEY, JSON.stringify(INITIAL_RECEIVABLES));

        const rawPay = localStorage.getItem(PAYABLES_KEY);
        if (rawPay) this.payables = JSON.parse(rawPay);
        else localStorage.setItem(PAYABLES_KEY, JSON.stringify(INITIAL_PAYABLES));

        const rawAdv = localStorage.getItem(ADVANCES_KEY);
        if (rawAdv) this.advances = JSON.parse(rawAdv);
        else localStorage.setItem(ADVANCES_KEY, JSON.stringify(INITIAL_ADVANCES));
      } catch (e) {
        console.error('Erro ao acessar localStorage financeiro:', e);
      }
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(this.transactions));
        localStorage.setItem(RECEIVABLES_KEY, JSON.stringify(this.receivables));
        localStorage.setItem(PAYABLES_KEY, JSON.stringify(this.payables));
        localStorage.setItem(ADVANCES_KEY, JSON.stringify(this.advances));
      } catch (e) {
        console.error('Erro ao persistir financeiro:', e);
      }
    }
  }

  public getTransactions(): FinancialTransaction[] {
    this.initStorage();
    return [...this.transactions];
  }

  public getReceivables(): TitleReceivable[] {
    this.initStorage();
    return [...this.receivables];
  }

  public getPayables(): TitlePayable[] {
    this.initStorage();
    return [...this.payables];
  }

  public getAdvances(): CustomerAdvance[] {
    this.initStorage();
    return [...this.advances];
  }

  public calculateSummary(): FinancialSummaryMetrics {
    this.initStorage();
    const confirmedTx = this.transactions.filter((t) => t.status === 'confirmado');
    const totalInflows = confirmedTx
      .filter((t) => t.type === 'entrada')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalOutflows = confirmedTx
      .filter((t) => t.type === 'saida')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalReceivables = this.receivables
      .filter((r) => r.status !== 'pago' && r.status !== 'cancelado')
      .reduce((acc, curr) => acc + curr.balanceDue, 0);

    const totalPayables = this.payables
      .filter((p) => p.status !== 'pago' && p.status !== 'cancelado')
      .reduce((acc, curr) => acc + curr.balanceDue, 0);

    const periodResult = Number((totalInflows - totalOutflows).toFixed(2));

    return {
      totalInflows: Number(totalInflows.toFixed(2)),
      totalOutflows: Number(totalOutflows.toFixed(2)),
      totalReceivables: Number(totalReceivables.toFixed(2)),
      totalPayables: Number(totalPayables.toFixed(2)),
      periodResult,
    };
  }

  public getCashFlowData(): CashFlowDataPoint[] {
    return [
      { periodLabel: '01-03 Set', inflows: 1250, outflows: 800, netResult: 450 },
      { periodLabel: '04-05 Set', inflows: 980, outflows: 1120, netResult: -140 },
      { periodLabel: '06-07 Set', inflows: 1840, outflows: 950, netResult: 890 },
      { periodLabel: '08 Set (Hoje)', inflows: 715, outflows: 2800, netResult: -2085 },
      { periodLabel: 'Projeção 09-12 Set', inflows: 2680, outflows: 1460, netResult: 1220 },
    ];
  }

  public createDirectTransaction(
    input: CreateDirectTransactionInput
  ): { success: boolean; transaction?: FinancialTransaction; error?: string } {
    this.initStorage();

    if (!input.description || !input.description.trim()) {
      return { success: false, error: 'A descrição do lançamento é obrigatória.' };
    }
    if (!input.amount || input.amount <= 0) {
      return { success: false, error: 'O valor deve ser maior que zero.' };
    }
    if (!input.category || !input.category.trim()) {
      return { success: false, error: 'Informe a categoria do lançamento.' };
    }

    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      date: input.date || '08/09/2026',
      description: input.description.trim(),
      category: input.category.trim(),
      type: input.type,
      origin: 'lancamento_direto',
      paymentMethod: input.paymentMethod,
      amount: Number(input.amount.toFixed(2)),
      status: 'confirmado',
      notes: input.notes?.trim(),
    };

    this.transactions = [newTx, ...this.transactions];
    this.persist();

    return { success: true, transaction: newTx };
  }

  public registerPayment(
    input: RegisterPaymentInput
  ): { success: boolean; error?: string } {
    this.initStorage();

    if (!input.paymentAmount || input.paymentAmount <= 0) {
      return { success: false, error: 'O valor do pagamento deve ser maior que zero.' };
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')}`;

    if (input.titleType === 'receivable') {
      const idx = this.receivables.findIndex((r) => r.id === input.titleId);
      if (idx === -1) return { success: false, error: 'Título a receber não encontrado.' };

      const rec = this.receivables[idx];
      if (input.paymentAmount > rec.balanceDue) {
        return {
          success: false,
          error: `O valor informado (R$ ${input.paymentAmount}) é superior ao saldo restante (R$ ${rec.balanceDue}).`,
        };
      }

      const newReceived = Number((rec.receivedAmount + input.paymentAmount).toFixed(2));
      const newBalance = Number((rec.originalAmount - newReceived).toFixed(2));
      const nextStatus = newBalance === 0 ? 'pago' : 'parcial';

      this.receivables[idx] = {
        ...rec,
        receivedAmount: newReceived,
        balanceDue: newBalance,
        status: nextStatus,
      };

      // Gera transação financeira correspondente de entrada
      const newTx: FinancialTransaction = {
        id: `tx-pay-${Date.now()}`,
        date: input.paymentDate || formattedDate,
        description: `Recebimento de Título: ${rec.clientName} (${rec.origin})`,
        category: 'Recebimento de Clientes',
        type: 'entrada',
        origin: 'pagamento_cliente',
        paymentMethod: input.paymentMethod,
        amount: input.paymentAmount,
        status: 'confirmado',
        referenceId: rec.id,
        notes: input.notes,
      };

      this.transactions = [newTx, ...this.transactions];
      this.persist();
      return { success: true };
    } else {
      const idx = this.payables.findIndex((p) => p.id === input.titleId);
      if (idx === -1) return { success: false, error: 'Título a pagar não encontrado.' };

      const pay = this.payables[idx];
      if (input.paymentAmount > pay.balanceDue) {
        return {
          success: false,
          error: `O valor informado (R$ ${input.paymentAmount}) é superior ao saldo devedor (R$ ${pay.balanceDue}).`,
        };
      }

      const newPaid = Number((pay.paidAmount + input.paymentAmount).toFixed(2));
      const newBalance = Number((pay.originalAmount - newPaid).toFixed(2));
      const nextStatus = newBalance === 0 ? 'pago' : 'parcial';

      this.payables[idx] = {
        ...pay,
        paidAmount: newPaid,
        balanceDue: newBalance,
        status: nextStatus,
      };

      // Gera transação financeira correspondente de saída
      const newTx: FinancialTransaction = {
        id: `tx-pay-${Date.now()}`,
        date: input.paymentDate || formattedDate,
        description: `Pagamento de Título: ${pay.supplierName} (${pay.description})`,
        category: 'Pagamento a Fornecedores',
        type: 'saida',
        origin: 'pagamento_fornecedor',
        paymentMethod: input.paymentMethod,
        amount: input.paymentAmount,
        status: 'confirmado',
        referenceId: pay.id,
        notes: input.notes,
      };

      this.transactions = [newTx, ...this.transactions];
      this.persist();
      return { success: true };
    }
  }
}

export const financialService = new FinancialService();
