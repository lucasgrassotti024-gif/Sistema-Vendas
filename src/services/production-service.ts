import {
  ProductionOrder,
  ProductionSummaryMetrics,
  CreateProductionInput,
  FinalizeProductionInput,
} from '@/types/production';

const STORAGE_KEY = 'veneza_brownies_production_v1';

export const INITIAL_PRODUCTION_ORDERS_SEED: ProductionOrder[] = [
  {
    id: 'op-101',
    orderNumber: 'OP-2026-001',
    productId: 'prod-1',
    productName: 'Brownie Tradicional Chocolate Nobre',
    plannedQuantity: 100,
    producedQuantity: 96,
    lostQuantity: 4,
    lossReason: 'Bordas queimadas por oscilação de temperatura no forno 2',
    scheduledDate: '08/09/2026',
    completedDate: '08/09/2026 11:30',
    responsibleName: 'Lucas Grassotti',
    status: 'completed',
    notes: 'Fornada da manhã para abastecimento da pronta-entrega.',
    materials: [
      { materialName: 'Chocolate Nobre Meio Amargo 54%', requiredQuantity: 1.5, consumedQuantity: 1.5, unit: 'kg' },
      { materialName: 'Farinha de Trigo Especial', requiredQuantity: 1.2, consumedQuantity: 1.2, unit: 'kg' },
      { materialName: 'Manteiga Extra Sem Sal', requiredQuantity: 0.9, consumedQuantity: 0.9, unit: 'kg' },
      { materialName: 'Açúcar Cristal Nobre', requiredQuantity: 0.9, consumedQuantity: 0.9, unit: 'kg' },
    ],
  },
  {
    id: 'op-102',
    orderNumber: 'OP-2026-002',
    productId: 'prod-2',
    productName: 'Brownie Recheado Ninho & Nutella',
    plannedQuantity: 60,
    producedQuantity: 35,
    scheduledDate: '08/09/2026',
    responsibleName: 'Mariana Silva',
    status: 'in_production',
    notes: 'Fase de recheio e selagem na bancada refrigerada.',
    materials: [
      { materialName: 'Chocolate Nobre Meio Amargo 54%', requiredQuantity: 1.0, consumedQuantity: 1.0, unit: 'kg' },
      { materialName: 'Creme de Avelã Nutella Original 3kg', requiredQuantity: 1.2, consumedQuantity: 0.7, unit: 'kg' },
      { materialName: 'Manteiga Extra Sem Sal', requiredQuantity: 0.6, consumedQuantity: 0.6, unit: 'kg' },
      { materialName: 'Leite em Pó Ninho', requiredQuantity: 0.5, consumedQuantity: 0.3, unit: 'kg' },
    ],
  },
  {
    id: 'op-103',
    orderNumber: 'OP-2026-003',
    productId: 'prod-3',
    productName: 'Brownie Recheado Doce de Leite Havanna',
    plannedQuantity: 40,
    producedQuantity: 0,
    scheduledDate: '09/09/2026',
    responsibleName: 'Lucas Grassotti',
    status: 'scheduled',
    notes: 'Programada para a primeira fornada de amanhã cedo.',
    materials: [
      { materialName: 'Chocolate Nobre Meio Amargo 54%', requiredQuantity: 0.7, consumedQuantity: 0, unit: 'kg' },
      { materialName: 'Doce de Leite Havanna Tradicional', requiredQuantity: 0.9, consumedQuantity: 0, unit: 'kg' },
      { materialName: 'Farinha de Trigo Especial', requiredQuantity: 0.5, consumedQuantity: 0, unit: 'kg' },
    ],
  },
  {
    id: 'op-104',
    orderNumber: 'OP-2026-004',
    productId: 'prod-4',
    productName: 'Caixa Presenteável Gourmet (4 un)',
    plannedQuantity: 25,
    producedQuantity: 0,
    scheduledDate: '09/09/2026',
    responsibleName: 'Mariana Silva',
    status: 'scheduled',
    notes: 'Montagem de kits para os pedidos de presentes agendados.',
    materials: [
      { materialName: 'Caixa Kraft 4 Brownies com Janela Acetato', requiredQuantity: 25, consumedQuantity: 0, unit: 'un' },
      { materialName: 'Fita de Cetim Dourada Personalizada Veneza (Rolo 50m)', requiredQuantity: 15, consumedQuantity: 0, unit: 'm' },
      { materialName: 'Adesivo Selo Veneza Brownies Folha Ouro', requiredQuantity: 25, consumedQuantity: 0, unit: 'un' },
    ],
  },
  {
    id: 'op-105',
    orderNumber: 'OP-2026-005',
    productId: 'prod-5',
    productName: 'Brownie Fit Cacau 70% & Castanhas',
    plannedQuantity: 30,
    producedQuantity: 0,
    scheduledDate: '07/09/2026',
    responsibleName: 'Lucas Grassotti',
    status: 'cancelled',
    notes: 'Cancelada por indisponibilidade de matéria-prima (cacau alcalino zerado no estoque).',
    materials: [
      { materialName: 'Cacau em Pó 100% Alcalino', requiredQuantity: 0.8, consumedQuantity: 0, unit: 'kg' },
      { materialName: 'Farinha de Amêndoas Fina', requiredQuantity: 0.6, consumedQuantity: 0, unit: 'kg' },
    ],
  },
];

class ProductionService {
  private memoryCache: ProductionOrder[] = [...INITIAL_PRODUCTION_ORDERS_SEED];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.memoryCache = parsed;
            this.isInitialized = true;
            return;
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTION_ORDERS_SEED));
      } catch (e) {
        console.error('Erro ao acessar localStorage de produção:', e);
      }
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryCache));
      } catch (e) {
        console.error('Erro ao persistir ordens de produção:', e);
      }
    }
  }

  public getAll(): ProductionOrder[] {
    this.initStorage();
    return [...this.memoryCache];
  }

  public getById(id: string): ProductionOrder | null {
    this.initStorage();
    return this.memoryCache.find((p) => p.id === id) || null;
  }

  public create(input: CreateProductionInput): { success: boolean; order?: ProductionOrder; error?: string } {
    this.initStorage();

    if (!input.productId) {
      return { success: false, error: 'Selecione o produto a ser produzido.' };
    }
    if (!input.plannedQuantity || input.plannedQuantity <= 0) {
      return { success: false, error: 'A quantidade planejada deve ser maior que zero.' };
    }
    if (!input.scheduledDate) {
      return { success: false, error: 'Informe a data programada para a produção.' };
    }
    if (!input.responsibleName || !input.responsibleName.trim()) {
      return { success: false, error: 'Informe o responsável pela produção.' };
    }

    // Geração da lista mock de insumos necessários proporcional à quantidade planejada
    const multiplier = input.plannedQuantity / 100;
    const materials = [
      {
        materialName: 'Chocolate Nobre Meio Amargo 54%',
        requiredQuantity: Number((1.5 * multiplier).toFixed(2)),
        consumedQuantity: 0,
        unit: 'kg',
      },
      {
        materialName: 'Farinha de Trigo Especial',
        requiredQuantity: Number((1.2 * multiplier).toFixed(2)),
        consumedQuantity: 0,
        unit: 'kg',
      },
      {
        materialName: 'Manteiga Extra Sem Sal',
        requiredQuantity: Number((0.9 * multiplier).toFixed(2)),
        consumedQuantity: 0,
        unit: 'kg',
      },
      {
        materialName: 'Açúcar Cristal Nobre',
        requiredQuantity: Number((0.9 * multiplier).toFixed(2)),
        consumedQuantity: 0,
        unit: 'kg',
      },
    ];

    const orderNumber = `OP-2026-${String(this.memoryCache.length + 1).padStart(3, '0')}`;

    const newOrder: ProductionOrder = {
      id: `op-${Date.now()}`,
      orderNumber,
      productId: input.productId,
      productName: input.productName,
      plannedQuantity: input.plannedQuantity,
      producedQuantity: 0,
      scheduledDate: input.scheduledDate,
      responsibleName: input.responsibleName.trim(),
      status: 'scheduled',
      notes: (input.notes || '').trim(),
      materials,
    };

    this.memoryCache = [newOrder, ...this.memoryCache];
    this.persist();

    return { success: true, order: newOrder };
  }

  public finalize(input: FinalizeProductionInput): { success: boolean; order?: ProductionOrder; error?: string } {
    this.initStorage();
    const index = this.memoryCache.findIndex((o) => o.id === input.orderId);
    if (index === -1) {
      return { success: false, error: 'Ordem de produção não encontrada.' };
    }

    if (input.producedQuantity < 0) {
      return { success: false, error: 'Quantidade produzida não pode ser negativa.' };
    }
    if (input.lostQuantity < 0) {
      return { success: false, error: 'Quantidade perdida não pode ser negativa.' };
    }

    const order = this.memoryCache[index];
    const now = new Date();
    const completedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    // Consome 100% dos insumos mockados
    const materials = order.materials.map((m) => ({
      ...m,
      consumedQuantity: m.requiredQuantity,
    }));

    const updatedOrder: ProductionOrder = {
      ...order,
      status: 'completed',
      producedQuantity: input.producedQuantity,
      lostQuantity: input.lostQuantity,
      lossReason: input.lossReason?.trim() || undefined,
      completedDate,
      notes: input.notes?.trim() ? `${order.notes ? order.notes + ' | ' : ''}${input.notes.trim()}` : order.notes,
      materials,
    };

    this.memoryCache[index] = updatedOrder;
    this.persist();

    return { success: true, order: updatedOrder };
  }

  public updateStatus(id: string, status: ProductionOrder['status']): { success: boolean; order?: ProductionOrder; error?: string } {
    this.initStorage();
    const index = this.memoryCache.findIndex((o) => o.id === id);
    if (index === -1) {
      return { success: false, error: 'Ordem de produção não encontrada.' };
    }

    this.memoryCache[index] = {
      ...this.memoryCache[index],
      status,
    };
    this.persist();

    return { success: true, order: this.memoryCache[index] };
  }

  public calculateSummary(orders: ProductionOrder[]): ProductionSummaryMetrics {
    const todayStr = '08/09/2026';
    const todayProductions = orders.filter((o) => o.scheduledDate === todayStr).length;
    const inProduction = orders.filter((o) => o.status === 'in_production').length;
    const scheduled = orders.filter((o) => o.status === 'scheduled').length;
    const completedPeriod = orders.filter((o) => o.status === 'completed').length;

    return {
      todayProductions,
      inProduction,
      scheduled,
      completedPeriod,
    };
  }
}

export const productionService = new ProductionService();
