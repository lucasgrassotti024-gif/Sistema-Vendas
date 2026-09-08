import {
  InventoryItem,
  InventoryMovement,
  InventorySummaryMetrics,
  NewMovementInput,
  calculateInventoryStatus,
} from '@/types/inventory';
import { productService } from './product-service';

const INVENTORY_STORAGE_KEY = 'veneza_brownies_inventory_v1';

// Semente padrão para Materiais e Embalagens
const DEFAULT_NON_PRODUCT_ITEMS: InventoryItem[] = [
  // Materiais (Insumos de Produção)
  {
    id: 'mat-1',
    name: 'Chocolate Nobre Meio Amargo 54%',
    sku: 'MAT-CHOC-54',
    type: 'material',
    unit: 'kg',
    currentStock: 18.5,
    minStock: 25.0,
    unitCost: 48.0,
    totalValue: 18.5 * 48.0,
    status: 'low_stock',
    category: 'Chocolates & Coberturas',
    notes: 'Insumo principal dos brownies. Ponto crítico de reposição.',
    movements: [
      {
        id: 'mov-mat-1',
        date: '08/09/2026 08:00',
        type: 'entrada',
        quantityChange: 50,
        resultingBalance: 50,
        reason: 'Compra Fornecedor Harald #NF-8821',
        reference: 'NF-8821',
        createdByName: 'Lucas Grassotti',
      },
      {
        id: 'mov-mat-2',
        date: '08/09/2026 14:30',
        type: 'consumo_producao',
        quantityChange: -31.5,
        resultingBalance: 18.5,
        reason: 'Consumo da fornada do dia #OP-104',
        reference: 'OP-104',
        createdByName: 'Sistema de Produção',
      },
    ],
  },
  {
    id: 'mat-2',
    name: 'Manteiga Extra Sem Sal',
    sku: 'MAT-MANT-EXTRA',
    type: 'material',
    unit: 'kg',
    currentStock: 12.0,
    minStock: 10.0,
    unitCost: 36.5,
    totalValue: 12.0 * 36.5,
    status: 'normal',
    category: 'Laticínios',
    movements: [
      {
        id: 'mov-mat-3',
        date: '07/09/2026 10:00',
        type: 'entrada',
        quantityChange: 20,
        resultingBalance: 20,
        reason: 'Entrada de mercadoria Laticínios Bela Vista',
        reference: 'PED-441',
        createdByName: 'Lucas Grassotti',
      },
      {
        id: 'mov-mat-4',
        date: '08/09/2026 09:00',
        type: 'consumo_producao',
        quantityChange: -8,
        resultingBalance: 12,
        reason: 'Requisição de cozinha para fornada #OP-104',
        reference: 'OP-104',
        createdByName: 'Sistema de Produção',
      },
    ],
  },
  {
    id: 'mat-3',
    name: 'Cacau em Pó 100% Alcalino',
    sku: 'MAT-CACAU-100',
    type: 'material',
    unit: 'kg',
    currentStock: 0.0,
    minStock: 8.0,
    unitCost: 52.0,
    totalValue: 0,
    status: 'out_of_stock',
    category: 'Secos & Farinhas',
    notes: 'URGENTE: Sem estoque para a fornada fit e especial de amanhã.',
    movements: [
      {
        id: 'mov-mat-5',
        date: '05/09/2026 11:00',
        type: 'entrada',
        quantityChange: 10,
        resultingBalance: 10,
        reason: 'Entrada lote semanal',
        reference: 'NF-8790',
        createdByName: 'Lucas Grassotti',
      },
      {
        id: 'mov-mat-6',
        date: '07/09/2026 17:00',
        type: 'consumo_producao',
        quantityChange: -10,
        resultingBalance: 0,
        reason: 'Esgotado na produção das encomendas do feriado',
        reference: 'OP-102',
        createdByName: 'Sistema de Produção',
      },
    ],
  },
  {
    id: 'mat-4',
    name: 'Açúcar Cristal Nobre',
    sku: 'MAT-ACUCAR-CRIS',
    type: 'material',
    unit: 'kg',
    currentStock: 45.0,
    minStock: 20.0,
    unitCost: 4.8,
    totalValue: 45.0 * 4.8,
    status: 'normal',
    category: 'Secos & Farinhas',
    movements: [
      {
        id: 'mov-mat-7',
        date: '06/09/2026 09:00',
        type: 'entrada',
        quantityChange: 60,
        resultingBalance: 60,
        reason: 'Compra atacado',
        reference: 'NF-8801',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'mat-5',
    name: 'Farinha de Trigo Especial',
    sku: 'MAT-TRIGO-ESP',
    type: 'material',
    unit: 'kg',
    currentStock: 30.0,
    minStock: 15.0,
    unitCost: 5.2,
    totalValue: 30.0 * 5.2,
    status: 'normal',
    category: 'Secos & Farinhas',
    movements: [
      {
        id: 'mov-mat-8',
        date: '06/09/2026 09:00',
        type: 'entrada',
        quantityChange: 50,
        resultingBalance: 50,
        reason: 'Compra atacado',
        reference: 'NF-8801',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'mat-6',
    name: 'Creme de Avelã Nutella Original 3kg',
    sku: 'MAT-NUTELLA-BALDE',
    type: 'material',
    unit: 'un',
    currentStock: 2.0,
    minStock: 4.0,
    unitCost: 195.0,
    totalValue: 2.0 * 195.0,
    status: 'low_stock',
    category: 'Recheios & Cremes',
    notes: 'Balde de 3kg. Reposição sugerida com distribuidor Ferrero.',
    movements: [
      {
        id: 'mov-mat-9',
        date: '01/09/2026 14:00',
        type: 'entrada',
        quantityChange: 6,
        resultingBalance: 6,
        reason: 'Lote mensal de recheios',
        reference: 'NF-8650',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },

  // Embalagens (Acondicionamento)
  {
    id: 'emb-1',
    name: 'Caixa Kraft 4 Brownies com Janela Acetato',
    sku: 'EMB-CX-4BRW',
    type: 'packaging',
    unit: 'un',
    currentStock: 8.0,
    minStock: 20.0,
    unitCost: 3.4,
    totalValue: 8.0 * 3.4,
    status: 'low_stock',
    category: 'Caixas Presenteáveis',
    notes: 'Abaixo do mínimo para atender os kits de final de semana.',
    movements: [
      {
        id: 'mov-emb-1',
        date: '02/09/2026 16:00',
        type: 'entrada',
        quantityChange: 50,
        resultingBalance: 50,
        reason: 'Recebimento gráfica gráfica parceira',
        reference: 'PED-430',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'emb-2',
    name: 'Saco Celofane Selável 10x15cm',
    sku: 'EMB-CELOF-1015',
    type: 'packaging',
    unit: 'cento',
    currentStock: 15.0,
    minStock: 5.0,
    unitCost: 12.5,
    totalValue: 15.0 * 12.5,
    status: 'normal',
    category: 'Sacos & Selagem',
    movements: [
      {
        id: 'mov-emb-2',
        date: '01/09/2026 10:00',
        type: 'entrada',
        quantityChange: 20,
        resultingBalance: 20,
        reason: 'Estoque mensal de selagem',
        reference: 'NF-8610',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'emb-3',
    name: 'Fita de Cetim Dourada Personalizada Veneza (Rolo 50m)',
    sku: 'EMB-FITA-DOUR-50M',
    type: 'packaging',
    unit: 'un',
    currentStock: 0.0,
    minStock: 3.0,
    unitCost: 28.0,
    totalValue: 0,
    status: 'out_of_stock',
    category: 'Fitas & Decoração',
    notes: 'Sem estoque no galpão. Encomendar com prazo de 5 dias úteis.',
    movements: [
      {
        id: 'mov-emb-3',
        date: '20/08/2026 14:00',
        type: 'entrada',
        quantityChange: 5,
        resultingBalance: 5,
        reason: 'Lote personalizado',
        reference: 'NF-8420',
        createdByName: 'Lucas Grassotti',
      },
      {
        id: 'mov-emb-4',
        date: '06/09/2026 18:00',
        type: 'perda',
        quantityChange: -1,
        resultingBalance: 0,
        reason: 'Rolo danificado por umidade no transporte',
        reference: 'AVARIA-09',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'emb-4',
    name: 'Adesivo Selo Veneza Brownies Folha Ouro',
    sku: 'EMB-ADES-OURO',
    type: 'packaging',
    unit: 'cento',
    currentStock: 18.0,
    minStock: 10.0,
    unitCost: 14.0,
    totalValue: 18.0 * 14.0,
    status: 'normal',
    category: 'Etiquetas & Tags',
    movements: [
      {
        id: 'mov-emb-5',
        date: '01/09/2026 10:00',
        type: 'entrada',
        quantityChange: 25,
        resultingBalance: 25,
        reason: 'Lote de etiquetas gráfica',
        reference: 'NF-8611',
        createdByName: 'Lucas Grassotti',
      },
    ],
  },
];

class InventoryService {
  private memoryNonProducts: InventoryItem[] = [...DEFAULT_NON_PRODUCT_ITEMS];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.memoryNonProducts = parsed;
            this.isInitialized = true;
            return;
          }
        }
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(DEFAULT_NON_PRODUCT_ITEMS));
      } catch (e) {
        console.error('Erro ao acessar localStorage de inventário:', e);
      }
    }
    this.isInitialized = true;
  }

  private persistNonProducts(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(this.memoryNonProducts));
      } catch (e) {
        console.error('Erro ao persistir itens de inventário:', e);
      }
    }
  }

  /**
   * Converte a lista de produtos persistidos do productService
   * para o formato de itens de estoque unificado.
   * Não duplica persistência: o saldo do produto vem do productService.
   */
  public getProductItems(): InventoryItem[] {
    const products = productService.getAll();
    return products.map((p) => {
      const status = calculateInventoryStatus(p.currentStock, p.minStock);
      const movements: InventoryMovement[] = (p.history || []).map((h) => {
        let mappedType: InventoryMovement['type'] = 'ajuste';
        if (h.type === 'entrada') mappedType = 'entrada';
        else if (h.type === 'saida') mappedType = 'saida';
        else if (h.type === 'venda') mappedType = 'saida';
        else if (h.type === 'devolucao') mappedType = 'entrada';

        return {
          id: h.id,
          date: h.date,
          type: mappedType,
          quantityChange: h.quantityChange,
          resultingBalance: p.currentStock,
          reason: h.description,
          reference: 'PROD-HIST',
          createdByName: 'Operador Catálogo',
        };
      });

      return {
        id: p.id,
        name: p.name,
        sku: p.code,
        type: 'product',
        unit: p.unit,
        currentStock: p.currentStock,
        minStock: p.minStock,
        unitCost: p.currentCost,
        totalValue: Number((p.currentStock * p.currentCost).toFixed(2)),
        status,
        category: p.category,
        notes: p.notes,
        movements,
      };
    });
  }

  /**
   * Retorna a lista unificada de todos os itens de estoque:
   * Produtos (do catálogo persistente) + Materiais + Embalagens
   */
  public getAll(): InventoryItem[] {
    this.initStorage();
    const productItems = this.getProductItems();
    return [...productItems, ...this.memoryNonProducts];
  }

  public getById(id: string): InventoryItem | null {
    const all = this.getAll();
    return all.find((item) => item.id === id) || null;
  }

  /**
   * Registra uma nova movimentação física de estoque (Entrada, Ajuste, Perda)
   * e recalcula os saldos imediatamente.
   */
  public createMovement(input: NewMovementInput): { success: boolean; item?: InventoryItem; error?: string } {
    this.initStorage();

    if (!input.itemId) {
      return { success: false, error: 'Selecione o item para movimentação.' };
    }
    if (!input.quantity || input.quantity <= 0) {
      return { success: false, error: 'A quantidade movimentada deve ser maior que zero.' };
    }
    if (!input.reason || !input.reason.trim()) {
      return { success: false, error: 'Informe o motivo ou justificativa da movimentação.' };
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    // Verifica se é um produto comercial
    const product = productService.getById(input.itemId);
    if (product) {
      let delta = 0;
      let newBalance = product.currentStock;

      if (input.type === 'entrada') {
        delta = input.quantity;
        newBalance = product.currentStock + delta;
      } else if (input.type === 'perda') {
        if (product.currentStock < input.quantity) {
          return { success: false, error: `Saldo insuficiente para baixa de perda. Saldo atual: ${product.currentStock} ${product.unit}.` };
        }
        delta = -input.quantity;
        newBalance = product.currentStock - input.quantity;
      } else if (input.type === 'ajuste') {
        delta = input.quantity - product.currentStock;
        newBalance = input.quantity;
      }

      // Atualiza o produto através do productService
      product.currentStock = newBalance;
      product.history = [
        {
          id: `mov-${Date.now()}`,
          type: input.type === 'entrada' ? 'entrada' : input.type === 'perda' ? 'saida' : 'ajuste',
          description: `${input.type.toUpperCase()}: ${input.reason.trim()}`,
          quantityChange: delta,
          date: formattedDate,
        },
        ...(product.history || []),
      ];

      productService.update(product.id, {
        name: product.name,
        code: product.code,
        category: product.category,
        unit: product.unit,
        salePrice: product.salePrice,
        currentCost: product.currentCost,
        minStock: product.minStock,
        status: product.status,
        description: product.description,
        notes: product.notes,
      });

      const updatedItem = this.getById(product.id);
      return { success: true, item: updatedItem || undefined };
    }

    // Caso seja Material ou Embalagem
    const index = this.memoryNonProducts.findIndex((m) => m.id === input.itemId);
    if (index === -1) {
      return { success: false, error: 'Item não encontrado no inventário.' };
    }

    const item = this.memoryNonProducts[index];
    let delta = 0;
    let newBalance = item.currentStock;

    if (input.type === 'entrada') {
      delta = input.quantity;
      newBalance = item.currentStock + delta;
    } else if (input.type === 'perda') {
      if (item.currentStock < input.quantity) {
        return { success: false, error: `Saldo insuficiente para registro de perda. Saldo disponível: ${item.currentStock} ${item.unit}.` };
      }
      delta = -input.quantity;
      newBalance = item.currentStock - input.quantity;
    } else if (input.type === 'ajuste') {
      delta = input.quantity - item.currentStock;
      newBalance = input.quantity;
    }

    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      date: formattedDate,
      type: input.type,
      quantityChange: delta,
      resultingBalance: newBalance,
      reason: input.reason.trim(),
      reference: input.reference?.trim() || 'MANUAL',
      createdByName: 'Lucas Grassotti',
    };

    const nextStatus = calculateInventoryStatus(newBalance, item.minStock);

    const updatedItem: InventoryItem = {
      ...item,
      currentStock: newBalance,
      totalValue: Number((newBalance * item.unitCost).toFixed(2)),
      status: nextStatus,
      movements: [newMov, ...item.movements],
    };

    this.memoryNonProducts[index] = updatedItem;
    this.persistNonProducts();

    return { success: true, item: updatedItem };
  }

  /**
   * Calcula indicadores do topo da página
   */
  public calculateSummary(items: InventoryItem[]): InventorySummaryMetrics {
    const totalItems = items.length;
    const lowStockItems = items.filter((i) => i.status === 'low_stock').length;
    const outOfStockItems = items.filter((i) => i.status === 'out_of_stock').length;
    const totalStockValue = items.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalStockValue: Number(totalStockValue.toFixed(2)),
    };
  }
}

export const inventoryService = new InventoryService();
