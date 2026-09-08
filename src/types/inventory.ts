export type InventoryItemType = 'product' | 'material' | 'packaging';

export type InventoryStatus = 'normal' | 'low_stock' | 'out_of_stock';

export type InventoryMovementType =
  | 'entrada'
  | 'saida'
  | 'ajuste'
  | 'perda'
  | 'consumo_producao';

export interface InventoryMovement {
  id: string;
  date: string;
  type: InventoryMovementType;
  quantityChange: number;
  resultingBalance: number;
  reason: string;
  reference?: string;
  createdByName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  type: InventoryItemType;
  unit: string;
  currentStock: number;
  minStock: number;
  unitCost: number;
  totalValue: number; // currentStock * unitCost
  status: InventoryStatus;
  category?: string;
  notes?: string;
  movements: InventoryMovement[];
}

export interface InventorySummaryMetrics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalStockValue: number;
}

export interface NewMovementInput {
  itemId: string;
  type: 'entrada' | 'ajuste' | 'perda';
  quantity: number;
  reason: string;
  reference?: string;
}

/**
 * Helper para calcular o status do item de inventário:
 * - out_of_stock se saldo <= 0
 * - low_stock se 0 < saldo <= minStock
 * - normal se saldo > minStock
 */
export function calculateInventoryStatus(currentStock: number, minStock: number): InventoryStatus {
  if (currentStock <= 0) return 'out_of_stock';
  if (currentStock <= minStock) return 'low_stock';
  return 'normal';
}
