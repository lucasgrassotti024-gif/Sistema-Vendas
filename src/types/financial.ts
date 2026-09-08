export type FinancialTransactionType = 'entrada' | 'saida';

export type FinancialOrigin =
  | 'venda'
  | 'pagamento_cliente'
  | 'compra'
  | 'pagamento_fornecedor'
  | 'despesa'
  | 'adiantamento'
  | 'ajuste'
  | 'lancamento_direto';

export type PaymentMethod =
  | 'pix'
  | 'dinheiro'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'boleto'
  | 'transferencia';

export type TitleStatus = 'aberto' | 'parcial' | 'pago' | 'vencido' | 'cancelado';

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: FinancialTransactionType;
  origin: FinancialOrigin;
  paymentMethod: PaymentMethod;
  amount: number;
  status: 'confirmado' | 'pendente' | 'estornado';
  referenceId?: string;
  notes?: string;
}

export interface TitleReceivable {
  id: string;
  clientName: string;
  origin: string; // Ex: Venda #VND-001, Pedido #PED-045
  dueDate: string;
  originalAmount: number;
  receivedAmount: number;
  balanceDue: number;
  status: TitleStatus;
  notes?: string;
}

export interface TitlePayable {
  id: string;
  supplierName: string;
  description: string;
  origin: string; // Ex: Compra #COM-2026-002
  dueDate: string;
  originalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: TitleStatus;
  notes?: string;
}

export interface CustomerAdvance {
  id: string;
  clientName: string;
  date: string;
  receivedAmount: number;
  appliedAmount: number;
  availableBalance: number;
  status: 'disponivel' | 'utilizado_parcial' | 'utilizado_total';
  notes?: string;
}

export interface FinancialSummaryMetrics {
  totalInflows: number; // Entradas
  totalOutflows: number; // Saídas
  totalReceivables: number; // A receber
  totalPayables: number; // A pagar
  periodResult: number; // Resultado = Entradas - Saídas
}

export interface CashFlowDataPoint {
  periodLabel: string;
  inflows: number;
  outflows: number;
  netResult: number;
}

export interface CreateDirectTransactionInput {
  type: FinancialTransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface RegisterPaymentInput {
  titleType: 'receivable' | 'payable';
  titleId: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export const TITLE_STATUS_CONFIG: Record<TitleStatus, { label: string; style: string }> = {
  aberto: {
    label: 'Aberto',
    style: 'bg-[#faf5e8] text-[#916b15] dark:bg-[#2c2415] dark:text-[#d4ac4a] border border-amber-300/40 dark:border-amber-700/40',
  },
  parcial: {
    label: 'Parcial',
    style: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#6ba1d6] border border-blue-300/40 dark:border-blue-700/40',
  },
  pago: {
    label: 'Pago',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  vencido: {
    label: 'Vencido',
    style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40',
  },
  cancelado: {
    label: 'Cancelado',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};
