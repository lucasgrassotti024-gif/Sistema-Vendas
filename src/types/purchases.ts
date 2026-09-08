export type PurchasePaymentStatus = 'paid' | 'partial' | 'pending' | 'cancelled';

export type PurchaseItemType = 'material' | 'packaging' | 'other';

export interface PurchaseItem {
  id: string;
  name: string;
  type: PurchaseItemType;
  quantity: number;
  unit: string;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseHistoryEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  author: string;
}

export interface PurchaseOrder {
  id: string;
  purchaseNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierDocument?: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: PurchasePaymentStatus;
  notes?: string;
  cancelReason?: string;
  cancelledAt?: string;
  history: PurchaseHistoryEvent[];
}

export interface Supplier {
  id: string;
  name: string;
  document: string; // CNPJ / CPF
  phone: string;
  email: string;
  notes?: string;
  active: boolean;
}

export interface PurchasesSummaryMetrics {
  periodPurchasesCount: number;
  totalPurchasedValue: number;
  totalPendingPayment: number;
  activeSuppliersCount: number;
}

export interface CreatePurchaseInput {
  supplierId: string;
  supplierName: string;
  supplierDocument?: string;
  date: string;
  items: {
    name: string;
    type: PurchaseItemType;
    quantity: number;
    unit: string;
    unitCost: number;
  }[];
  discount: number;
  paidAmount: number;
  notes?: string;
}

export interface CancelPurchaseInput {
  purchaseId: string;
  reason: string;
}

export interface CreateSupplierInput {
  name: string;
  document: string;
  phone: string;
  email: string;
  notes?: string;
}

export const PURCHASE_STATUS_CONFIG: Record<
  PurchasePaymentStatus,
  { label: string; style: string }
> = {
  paid: {
    label: 'Pago',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  partial: {
    label: 'Parcial',
    style: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#6ba1d6] border border-blue-300/40 dark:border-blue-700/40',
  },
  pending: {
    label: 'Pendente',
    style: 'bg-[#faf5e8] text-[#916b15] dark:bg-[#2c2415] dark:text-[#d4ac4a] border border-amber-300/40 dark:border-amber-700/40',
  },
  cancelled: {
    label: 'Cancelado',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};
