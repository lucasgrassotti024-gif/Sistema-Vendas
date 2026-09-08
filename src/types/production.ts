export type ProductionStatus =
  | 'scheduled'
  | 'in_production'
  | 'completed'
  | 'cancelled';

export interface ProductionMaterial {
  materialName: string;
  requiredQuantity: number;
  consumedQuantity: number;
  unit: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  plannedQuantity: number;
  producedQuantity: number;
  lostQuantity?: number;
  lossReason?: string;
  scheduledDate: string;
  completedDate?: string;
  responsibleName: string;
  status: ProductionStatus;
  notes?: string;
  materials: ProductionMaterial[];
}

export interface ProductionSummaryMetrics {
  todayProductions: number;
  inProduction: number;
  scheduled: number;
  completedPeriod: number;
}

export interface CreateProductionInput {
  productId: string;
  productName: string;
  plannedQuantity: number;
  scheduledDate: string;
  responsibleName: string;
  notes?: string;
}

export interface FinalizeProductionInput {
  orderId: string;
  producedQuantity: number;
  lostQuantity: number;
  lossReason?: string;
  notes?: string;
}

export const STATUS_LABELS: Record<ProductionStatus, { label: string; style: string }> = {
  scheduled: {
    label: 'Programada',
    style: 'bg-[#faf5e8] text-[#916b15] dark:bg-[#2c2415] dark:text-[#d4ac4a] border border-amber-300/40 dark:border-amber-700/40',
  },
  in_production: {
    label: 'Em Produção',
    style: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#6ba1d6] border border-blue-300/40 dark:border-blue-700/40',
  },
  completed: {
    label: 'Concluída',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  cancelled: {
    label: 'Cancelada',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};
