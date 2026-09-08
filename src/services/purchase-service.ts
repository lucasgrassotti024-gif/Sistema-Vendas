import {
  PurchaseOrder,
  Supplier,
  PurchasesSummaryMetrics,
  CreatePurchaseInput,
  CancelPurchaseInput,
  CreateSupplierInput,
  PurchasePaymentStatus,
} from '@/types/purchases';

const PURCHASES_STORAGE_KEY = 'veneza_brownies_purchases_v1';
const SUPPLIERS_STORAGE_KEY = 'veneza_brownies_suppliers_v1';

export const INITIAL_SUPPLIERS_SEED: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Harald Chocolates Nobres S.A.',
    document: '12.345.678/0001-90',
    phone: '(11) 3456-7890',
    email: 'pedidos@harald.com.br',
    notes: 'Fornecedor chave de chocolate 54% e cacau em pó.',
    active: true,
  },
  {
    id: 'sup-2',
    name: 'Laticínios Bela Vista Ltda',
    document: '98.765.432/0001-11',
    phone: '(19) 3881-2200',
    email: 'comercial@belavista.com.br',
    notes: 'Fornecimento semanal de manteiga extra e leite.',
    active: true,
  },
  {
    id: 'sup-3',
    name: 'Gráfica & Embalagens Premium Kraft',
    document: '45.123.789/0001-55',
    phone: '(11) 98765-4321',
    email: 'contato@kraftembalagens.com.br',
    notes: 'Caixas presenteáveis, sacos celofane e fitas com foil dourado.',
    active: true,
  },
  {
    id: 'sup-4',
    name: 'Distribuidora Ferrero & Recheios',
    document: '33.222.111/0001-88',
    phone: '(11) 4004-9988',
    email: 'vendas@distribuidoraferrero.com.br',
    notes: 'Nutella em baldes de 3kg e doce de leite Havanna.',
    active: true,
  },
];

export const INITIAL_PURCHASES_SEED: PurchaseOrder[] = [
  {
    id: 'com-1',
    purchaseNumber: 'COM-2026-001',
    date: '05/09/2026',
    supplierId: 'sup-1',
    supplierName: 'Harald Chocolates Nobres S.A.',
    supplierDocument: '12.345.678/0001-90',
    items: [
      {
        id: 'ci-1',
        name: 'Chocolate Nobre Meio Amargo 54%',
        type: 'material',
        quantity: 50,
        unit: 'kg',
        unitCost: 48.0,
        subtotal: 2400.0,
      },
      {
        id: 'ci-2',
        name: 'Cacau em Pó 100% Alcalino',
        type: 'material',
        quantity: 10,
        unit: 'kg',
        unitCost: 52.0,
        subtotal: 520.0,
      },
    ],
    subtotal: 2920.0,
    discount: 120.0,
    totalAmount: 2800.0,
    paidAmount: 2800.0,
    balanceDue: 0.0,
    status: 'paid',
    notes: 'Pedido faturado com entrega na doca 1.',
    history: [
      {
        id: 'ev-1',
        date: '05/09/2026 09:15',
        title: 'Compra Criada',
        description: 'Pedido de compra registrado com desconto comercial negociado.',
        author: 'Lucas Grassotti',
      },
      {
        id: 'ev-2',
        date: '05/09/2026 10:00',
        title: 'Pagamento Integral Registrado',
        description: 'Pagamento via PIX no valor de R$ 2.800,00 confirmado pelo financeiro.',
        author: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'com-2',
    purchaseNumber: 'COM-2026-002',
    date: '06/09/2026',
    supplierId: 'sup-2',
    supplierName: 'Laticínios Bela Vista Ltda',
    supplierDocument: '98.765.432/0001-11',
    items: [
      {
        id: 'ci-3',
        name: 'Manteiga Extra Sem Sal',
        type: 'material',
        quantity: 40,
        unit: 'kg',
        unitCost: 36.5,
        subtotal: 1460.0,
      },
    ],
    subtotal: 1460.0,
    discount: 0.0,
    totalAmount: 1460.0,
    paidAmount: 730.0,
    balanceDue: 730.0,
    status: 'partial',
    notes: 'Condição 50% à vista e 50% para 15 dias.',
    history: [
      {
        id: 'ev-3',
        date: '06/09/2026 11:30',
        title: 'Compra Criada',
        description: 'Lote semanal de manteiga cadastrado.',
        author: 'Lucas Grassotti',
      },
      {
        id: 'ev-4',
        date: '06/09/2026 11:35',
        title: 'Pagamento Parcial Registrado',
        description: 'Sinal de 50% pago via transferência bancária.',
        author: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'com-3',
    purchaseNumber: 'COM-2026-003',
    date: '07/09/2026',
    supplierId: 'sup-3',
    supplierName: 'Gráfica & Embalagens Premium Kraft',
    supplierDocument: '45.123.789/0001-55',
    items: [
      {
        id: 'ci-4',
        name: 'Caixa Kraft 4 Brownies com Janela Acetato',
        type: 'packaging',
        quantity: 100,
        unit: 'un',
        unitCost: 3.4,
        subtotal: 340.0,
      },
      {
        id: 'ci-5',
        name: 'Fita de Cetim Dourada Personalizada Veneza (Rolo 50m)',
        type: 'packaging',
        quantity: 5,
        unit: 'un',
        unitCost: 28.0,
        subtotal: 140.0,
      },
    ],
    subtotal: 480.0,
    discount: 0.0,
    totalAmount: 480.0,
    paidAmount: 0.0,
    balanceDue: 480.0,
    status: 'pending',
    notes: 'Boleto bancário a vencer em 14/09/2026.',
    history: [
      {
        id: 'ev-5',
        date: '07/09/2026 14:20',
        title: 'Compra Criada',
        description: 'Compra a prazo gerada aguardando compensação do boleto.',
        author: 'Lucas Grassotti',
      },
    ],
  },
  {
    id: 'com-4',
    purchaseNumber: 'COM-2026-004',
    date: '04/09/2026',
    supplierId: 'sup-4',
    supplierName: 'Distribuidora Ferrero & Recheios',
    supplierDocument: '33.222.111/0001-88',
    items: [
      {
        id: 'ci-6',
        name: 'Creme de Avelã Nutella Original 3kg',
        type: 'material',
        quantity: 4,
        unit: 'un',
        unitCost: 195.0,
        subtotal: 780.0,
      },
    ],
    subtotal: 780.0,
    discount: 30.0,
    totalAmount: 750.0,
    paidAmount: 0.0,
    balanceDue: 750.0,
    status: 'cancelled',
    notes: 'Cancelamento acordado com fornecedor por atraso na entrega.',
    cancelReason: 'Prazo estourado pelo distribuidor e carga danificada na transportadora.',
    cancelledAt: '04/09/2026 16:00',
    history: [
      {
        id: 'ev-6',
        date: '04/09/2026 10:00',
        title: 'Compra Criada',
        description: 'Pedido gerado.',
        author: 'Lucas Grassotti',
      },
      {
        id: 'ev-7',
        date: '04/09/2026 16:00',
        title: 'Compra Cancelada',
        description: 'Cancelamento por atraso logístico e avaria no transporte.',
        author: 'Lucas Grassotti',
      },
    ],
  },
];

class PurchaseService {
  private purchasesCache: PurchaseOrder[] = [...INITIAL_PURCHASES_SEED];
  private suppliersCache: Supplier[] = [...INITIAL_SUPPLIERS_SEED];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const rawPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
        if (rawPurchases) {
          const parsed = JSON.parse(rawPurchases);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.purchasesCache = parsed;
          }
        } else {
          localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(INITIAL_PURCHASES_SEED));
        }

        const rawSuppliers = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
        if (rawSuppliers) {
          const parsedSup = JSON.parse(rawSuppliers);
          if (Array.isArray(parsedSup) && parsedSup.length > 0) {
            this.suppliersCache = parsedSup;
          }
        } else {
          localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(INITIAL_SUPPLIERS_SEED));
        }
      } catch (e) {
        console.error('Erro ao acessar localStorage de compras:', e);
      }
    }
    this.isInitialized = true;
  }

  private persistPurchases(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(this.purchasesCache));
      } catch (e) {
        console.error('Erro ao persistir compras:', e);
      }
    }
  }

  private persistSuppliers(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(this.suppliersCache));
      } catch (e) {
        console.error('Erro ao persistir fornecedores:', e);
      }
    }
  }

  public getAll(): PurchaseOrder[] {
    this.initStorage();
    return [...this.purchasesCache];
  }

  public getById(id: string): PurchaseOrder | null {
    this.initStorage();
    return this.purchasesCache.find((p) => p.id === id) || null;
  }

  public getSuppliers(): Supplier[] {
    this.initStorage();
    return [...this.suppliersCache];
  }

  public createSupplier(input: CreateSupplierInput): { success: boolean; supplier?: Supplier; error?: string } {
    this.initStorage();
    if (!input.name || !input.name.trim()) {
      return { success: false, error: 'O nome da empresa/fornecedor é obrigatório.' };
    }

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: input.name.trim(),
      document: input.document.trim() || 'Não informado',
      phone: input.phone.trim() || 'Não informado',
      email: input.email.trim() || 'Não informado',
      notes: input.notes?.trim() || undefined,
      active: true,
    };

    this.suppliersCache = [newSup, ...this.suppliersCache];
    this.persistSuppliers();

    return { success: true, supplier: newSup };
  }

  public create(input: CreatePurchaseInput): { success: boolean; purchase?: PurchaseOrder; error?: string } {
    this.initStorage();

    if (!input.supplierId) {
      return { success: false, error: 'Selecione o fornecedor da compra.' };
    }
    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Adicione pelo menos um item à compra.' };
    }
    for (const it of input.items) {
      if (!it.name.trim()) return { success: false, error: 'O nome do item é obrigatório.' };
      if (it.quantity <= 0) return { success: false, error: `Quantidade de "${it.name}" deve ser maior que zero.` };
      if (it.unitCost < 0) return { success: false, error: `Custo de "${it.name}" não pode ser negativo.` };
    }

    const items: PurchaseOrder['items'] = input.items.map((it, idx) => ({
      id: `ci-${Date.now()}-${idx}`,
      name: it.name.trim(),
      type: it.type,
      quantity: it.quantity,
      unit: it.unit,
      unitCost: it.unitCost,
      subtotal: Number((it.quantity * it.unitCost).toFixed(2)),
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
    const safeDiscount = Math.max(0, input.discount || 0);
    const totalAmount = Math.max(0, Number((subtotal - safeDiscount).toFixed(2)));
    const safePaidAmount = Math.max(0, Math.min(totalAmount, input.paidAmount || 0));
    const balanceDue = Number((totalAmount - safePaidAmount).toFixed(2));

    let status: PurchasePaymentStatus = 'pending';
    if (balanceDue === 0 && totalAmount > 0) {
      status = 'paid';
    } else if (safePaidAmount > 0 && balanceDue > 0) {
      status = 'partial';
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const purchaseNumber = `COM-2026-${String(this.purchasesCache.length + 1).padStart(3, '0')}`;

    const newPurchase: PurchaseOrder = {
      id: `com-${Date.now()}`,
      purchaseNumber,
      date: input.date || now.toLocaleDateString('pt-BR'),
      supplierId: input.supplierId,
      supplierName: input.supplierName,
      supplierDocument: input.supplierDocument,
      items,
      subtotal,
      discount: safeDiscount,
      totalAmount,
      paidAmount: safePaidAmount,
      balanceDue,
      status,
      notes: input.notes?.trim() || undefined,
      history: [
        {
          id: `ev-${Date.now()}-1`,
          date: formattedDate,
          title: 'Compra Criada',
          description: `Compra registrada com valor total de R$ ${totalAmount.toFixed(2)}.`,
          author: 'Lucas Grassotti',
        },
        ...(safePaidAmount > 0
          ? [
              {
                id: `ev-${Date.now()}-2`,
                date: formattedDate,
                title: status === 'paid' ? 'Pagamento Integral Registrado' : 'Pagamento Parcial Registrado',
                description: `Valor pago de R$ ${safePaidAmount.toFixed(2)}. Saldo restante: R$ ${balanceDue.toFixed(2)}.`,
                author: 'Lucas Grassotti',
              },
            ]
          : []),
      ],
    };

    this.purchasesCache = [newPurchase, ...this.purchasesCache];
    this.persistPurchases();

    return { success: true, purchase: newPurchase };
  }

  public cancel(input: CancelPurchaseInput): { success: boolean; purchase?: PurchaseOrder; error?: string } {
    this.initStorage();
    const index = this.purchasesCache.findIndex((p) => p.id === input.purchaseId);
    if (index === -1) {
      return { success: false, error: 'Compra não encontrada.' };
    }
    if (!input.reason || !input.reason.trim()) {
      return { success: false, error: 'Informe o motivo do cancelamento da compra.' };
    }

    const current = this.purchasesCache[index];
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const updated: PurchaseOrder = {
      ...current,
      status: 'cancelled',
      cancelReason: input.reason.trim(),
      cancelledAt: formattedDate,
      history: [
        {
          id: `ev-${Date.now()}-cancel`,
          date: formattedDate,
          title: 'Compra Cancelada',
          description: `Motivo: ${input.reason.trim()}`,
          author: 'Lucas Grassotti',
        },
        ...current.history,
      ],
    };

    this.purchasesCache[index] = updated;
    this.persistPurchases();

    return { success: true, purchase: updated };
  }

  public calculateSummary(purchases: PurchaseOrder[]): PurchasesSummaryMetrics {
    const activePurchases = purchases.filter((p) => p.status !== 'cancelled');
    const periodPurchasesCount = activePurchases.length;
    const totalPurchasedValue = activePurchases.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalPendingPayment = activePurchases.reduce((acc, curr) => acc + curr.balanceDue, 0);
    const activeSuppliersCount = this.suppliersCache.filter((s) => s.active).length;

    return {
      periodPurchasesCount,
      totalPurchasedValue: Number(totalPurchasedValue.toFixed(2)),
      totalPendingPayment: Number(totalPendingPayment.toFixed(2)),
      activeSuppliersCount,
    };
  }
}

export const purchaseService = new PurchaseService();
