import {
  ProductData,
  ProductMovementHistory,
  calculateCommercialMetrics,
  ProductsSummaryMetrics,
} from '@/types/products';

const STORAGE_KEY = 'veneza_brownies_products_v1';

export const INITIAL_PRODUCTS_SEED: ProductData[] = [
  {
    id: 'prod-1',
    code: 'BRW-TRAD',
    name: 'Brownie Tradicional Chocolate Nobre',
    description: 'Brownie artesanal 70g com casquinha crocante e interior macio e denso.',
    category: 'Brownies Tradicionais',
    unit: 'un',
    salePrice: 10.0,
    currentCost: 3.85,
    marginPercent: 61.5,
    currentStock: 48,
    minStock: 20,
    status: 'active',
    notes: 'Item de maior giro na loja e pronta entrega.',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    history: [
      {
        id: 'mov-1',
        type: 'entrada',
        description: 'Saldo inicial de implantação',
        quantityChange: 48,
        date: '08/09/2026 08:30',
      },
    ],
    priceHistory: [
      {
        id: 'ph-1',
        previousPrice: 9.0,
        newPrice: 10.0,
        date: '01/09/2026',
      },
    ],
  },
  {
    id: 'prod-2',
    code: 'BRW-NINHO',
    name: 'Brownie Recheado Ninho & Nutella',
    description: 'Massa tradicional recheada com brigadeiro de Leite Ninho e cobertura generosa de Nutella pura.',
    category: 'Brownies Especiais',
    unit: 'un',
    salePrice: 14.0,
    currentCost: 5.6,
    marginPercent: 60.0,
    currentStock: 12,
    minStock: 15,
    status: 'active',
    notes: 'Requer atenção: estoque abaixo do mínimo recomendado.',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    history: [
      {
        id: 'mov-2',
        type: 'entrada',
        description: 'Saldo inicial de implantação',
        quantityChange: 12,
        date: '08/09/2026 09:00',
      },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-3',
    code: 'BRW-DOCELEITE',
    name: 'Brownie Recheado Doce de Leite Havanna',
    description: 'Brownie recheado com legítimo doce de leite argentino.',
    category: 'Brownies Especiais',
    unit: 'un',
    salePrice: 13.5,
    currentCost: 5.1,
    marginPercent: 62.22,
    currentStock: 35,
    minStock: 15,
    status: 'active',
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    history: [
      {
        id: 'mov-3',
        type: 'entrada',
        description: 'Saldo inicial de implantação',
        quantityChange: 35,
        date: '08/09/2026 09:15',
      },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-4',
    code: 'KIT-PRES-4',
    name: 'Caixa Presenteável Gourmet (4 un)',
    description: 'Caixa kraft selada com fita de cetim dourada, contendo 4 brownies sortidos.',
    category: 'Kits & Caixas',
    unit: 'caixa',
    salePrice: 52.0,
    currentCost: 21.0,
    marginPercent: 59.62,
    currentStock: 8,
    minStock: 10,
    status: 'active',
    notes: 'Embalagens especiais limitadas.',
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    history: [
      {
        id: 'mov-4',
        type: 'entrada',
        description: 'Saldo inicial de implantação',
        quantityChange: 8,
        date: '08/09/2026 09:30',
      },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-5',
    code: 'BRW-FIT-CACAU',
    name: 'Brownie Fit Cacau 70% & Castanhas',
    description: 'Versão zero lactose, adoçada com eritritol e farinha de amêndoas.',
    category: 'Brownies Tradicionais',
    unit: 'un',
    salePrice: 15.0,
    currentCost: 7.2,
    marginPercent: 52.0,
    currentStock: 0,
    minStock: 10,
    status: 'inactive',
    notes: 'Temporariamente pausado para reformulação de fornecedor de amêndoas.',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
    history: [
      {
        id: 'mov-5',
        type: 'ajuste',
        description: 'Ajuste de inventário para inativação',
        quantityChange: 0,
        date: '08/09/2026 10:00',
      },
    ],
    priceHistory: [],
  },
];

export interface CreateProductInput {
  name: string;
  code: string;
  description?: string;
  category: string;
  unit: string;
  salePrice: number;
  currentCost: number;
  initialStock: number;
  minStock: number;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface UpdateProductInput {
  name: string;
  code: string;
  description?: string;
  category: string;
  unit: string;
  salePrice: number;
  currentCost: number;
  minStock: number;
  status: 'active' | 'inactive';
  notes?: string;
}

class ProductService {
  // Cache em memória para Node/SSR/CLI e sincronização
  private memoryCache: ProductData[] = [...INITIAL_PRODUCTS_SEED];
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS_SEED));
      } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
      }
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryCache));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
    }
  }

  public getAll(): ProductData[] {
    this.initStorage();
    return [...this.memoryCache];
  }

  public getById(id: string): ProductData | null {
    this.initStorage();
    return this.memoryCache.find((p) => p.id === id) || null;
  }

  public isSkuAvailable(code: string, excludeId?: string): boolean {
    this.initStorage();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return false;
    return !this.memoryCache.some((p) => p.code.toUpperCase() === normalized && p.id !== excludeId);
  }

  public generateSkuSuggestion(name: string, category: string): string {
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .toUpperCase();

    let prefix = 'BRW';
    if (category.toLowerCase().includes('kit') || category.toLowerCase().includes('caixa')) {
      prefix = 'KIT';
    } else if (category.toLowerCase().includes('encomenda') || category.toLowerCase().includes('festa')) {
      prefix = 'ENC';
    }

    const words = cleanName.split(/\s+/).filter(Boolean);
    const suffix = words.slice(0, 2).map((w) => w.substring(0, 4)).join('-');
    const baseSku = suffix ? `${prefix}-${suffix}` : `${prefix}-NOVO`;

    let candidate = baseSku;
    let counter = 1;
    while (!this.isSkuAvailable(candidate)) {
      candidate = `${baseSku}-${counter}`;
      counter++;
    }
    return candidate;
  }

  public create(input: CreateProductInput): { success: boolean; product?: ProductData; error?: string } {
    this.initStorage();

    if (!input.name || !input.name.trim()) {
      return { success: false, error: 'O nome do produto é obrigatório.' };
    }
    if (!input.code || !input.code.trim()) {
      return { success: false, error: 'O código/SKU é obrigatório.' };
    }
    const cleanSku = input.code.trim().toUpperCase();
    if (!this.isSkuAvailable(cleanSku)) {
      return { success: false, error: `O SKU "${cleanSku}" já está cadastrado em outro produto.` };
    }
    if (input.salePrice <= 0) {
      return { success: false, error: 'O preço de venda deve ser maior que zero.' };
    }
    if (input.currentCost < 0) {
      return { success: false, error: 'O custo do produto não pode ser negativo.' };
    }
    if (input.initialStock < 0) {
      return { success: false, error: 'O estoque inicial não pode ser negativo.' };
    }
    if (input.minStock < 0) {
      return { success: false, error: 'O estoque mínimo de alerta não pode ser negativo.' };
    }

    const metrics = calculateCommercialMetrics(input.salePrice, input.currentCost);
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const initialHistory: ProductMovementHistory[] = [];
    if (input.initialStock > 0) {
      initialHistory.push({
        id: `mov-${Date.now()}-init`,
        type: 'entrada',
        description: 'Saldo inicial de implantação de cadastro',
        quantityChange: input.initialStock,
        date: formattedDate,
      });
    }

    const newProduct: ProductData = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      code: cleanSku,
      name: input.name.trim(),
      description: (input.description || '').trim(),
      category: input.category || 'Geral',
      unit: input.unit || 'un',
      salePrice: metrics.salePrice,
      currentCost: metrics.currentCost,
      marginPercent: metrics.marginPercent,
      currentStock: input.initialStock,
      minStock: input.minStock,
      status: input.status,
      notes: (input.notes || '').trim(),
      history: initialHistory,
      priceHistory: [
        {
          id: `ph-${Date.now()}`,
          previousPrice: 0,
          newPrice: metrics.salePrice,
          date: now.toLocaleDateString('pt-BR'),
        },
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.memoryCache = [newProduct, ...this.memoryCache];
    this.persist();

    return { success: true, product: newProduct };
  }

  public update(id: string, input: UpdateProductInput): { success: boolean; product?: ProductData; error?: string } {
    this.initStorage();
    const index = this.memoryCache.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Produto não encontrado.' };
    }

    if (!input.name || !input.name.trim()) {
      return { success: false, error: 'O nome do produto é obrigatório.' };
    }
    if (!input.code || !input.code.trim()) {
      return { success: false, error: 'O código/SKU é obrigatório.' };
    }
    const cleanSku = input.code.trim().toUpperCase();
    if (!this.isSkuAvailable(cleanSku, id)) {
      return { success: false, error: `O SKU "${cleanSku}" já está em uso por outro produto.` };
    }
    if (input.salePrice <= 0) {
      return { success: false, error: 'O preço de venda deve ser maior que zero.' };
    }
    if (input.currentCost < 0) {
      return { success: false, error: 'O custo do produto não pode ser negativo.' };
    }
    if (input.minStock < 0) {
      return { success: false, error: 'O estoque mínimo de alerta não pode ser negativo.' };
    }

    const currentProd = this.memoryCache[index];
    const metrics = calculateCommercialMetrics(input.salePrice, input.currentCost);
    const now = new Date();

    const priceHistory = [...currentProd.priceHistory];
    if (currentProd.salePrice !== metrics.salePrice) {
      priceHistory.unshift({
        id: `ph-${Date.now()}`,
        previousPrice: currentProd.salePrice,
        newPrice: metrics.salePrice,
        date: now.toLocaleDateString('pt-BR'),
      });
    }

    const updatedProd: ProductData = {
      ...currentProd,
      code: cleanSku,
      name: input.name.trim(),
      description: (input.description || '').trim(),
      category: input.category,
      unit: input.unit,
      salePrice: metrics.salePrice,
      currentCost: metrics.currentCost,
      marginPercent: metrics.marginPercent,
      minStock: input.minStock,
      status: input.status,
      notes: (input.notes || '').trim(),
      priceHistory,
      updatedAt: now.toISOString(),
    };

    this.memoryCache[index] = updatedProd;
    this.persist();

    return { success: true, product: updatedProd };
  }

  public toggleStatus(id: string): { success: boolean; product?: ProductData; error?: string } {
    this.initStorage();
    const index = this.memoryCache.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Produto não encontrado.' };
    }

    const target = this.memoryCache[index];
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    const now = new Date();

    const updatedProd: ProductData = {
      ...target,
      status: nextStatus,
      updatedAt: now.toISOString(),
    };

    this.memoryCache[index] = updatedProd;
    this.persist();

    return { success: true, product: updatedProd };
  }

  public calculateSummary(products: ProductData[]): ProductsSummaryMetrics {
    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === 'active').length,
      inactiveProducts: products.filter((p) => p.status === 'inactive').length,
      lowStockProducts: products.filter((p) => p.status === 'active' && p.currentStock <= p.minStock).length,
    };
  }
}

export const productService = new ProductService();
