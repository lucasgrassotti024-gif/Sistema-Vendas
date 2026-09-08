export interface ProductMovementHistory {
  id: string;
  type: 'entrada' | 'saida' | 'ajuste' | 'venda' | 'devolucao';
  description: string;
  quantityChange: number;
  date: string;
}

export interface PriceHistoryItem {
  id: string;
  previousPrice: number;
  newPrice: number;
  date: string;
}

export type ProductStatus = 'active' | 'inactive';

export interface ProductData {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  salePrice: number;
  currentCost: number;
  marginPercent: number;
  currentStock: number;
  minStock: number;
  status: ProductStatus;
  notes?: string;
  history: ProductMovementHistory[];
  priceHistory: PriceHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsSummaryMetrics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
}

export const PRODUCT_CATEGORIES = [
  'Todos',
  'Brownies Tradicionais',
  'Brownies Especiais',
  'Kits & Caixas',
  'Encomendas & Festas',
  'Geral',
];

export const MOCK_PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;

/**
 * Regra Única de Cálculo Comercial:
 * - Lucro Unitário = Preço de Venda - Custo
 * - Margem Bruta (%) = (Lucro Unitário / Preço de Venda) * 100
 */
export function calculateCommercialMetrics(salePrice: number, currentCost: number) {
  const safeSalePrice = Math.max(0, salePrice || 0);
  const safeCost = Math.max(0, currentCost || 0);
  const unitProfit = safeSalePrice - safeCost;
  const marginPercent = safeSalePrice > 0 ? (unitProfit / safeSalePrice) * 100 : 0;

  return {
    salePrice: safeSalePrice,
    currentCost: safeCost,
    unitProfit: Number(unitProfit.toFixed(2)),
    marginPercent: Number(marginPercent.toFixed(2)),
  };
}
