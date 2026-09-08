export type ProductStatus = 'active' | 'inactive';

export interface ProductMovementHistory {
  id: string;
  type: 'sale' | 'production' | 'adjustment';
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
}

export interface ProductsSummaryMetrics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
}

export const MOCK_PRODUCT_CATEGORIES = [
  'Todos',
  'Brownies Tradicionais',
  'Brownies Especiais',
  'Kits & Caixas',
  'Encomendas & Festas',
];

export const MOCK_PRODUCTS_SUMMARY: ProductsSummaryMetrics = {
  totalProducts: 12,
  activeProducts: 10,
  inactiveProducts: 2,
  lowStockProducts: 3,
};

export const MOCK_PRODUCTS_LIST: ProductData[] = [
  {
    id: 'prod-1',
    code: 'BRW-TRAD',
    name: 'Brownie Tradicional',
    description: 'Brownie artesanal de chocolate meio amargo com casquinha crocante e textura úmida.',
    category: 'Brownies Tradicionais',
    unit: 'un',
    salePrice: 10.0,
    currentCost: 3.8,
    marginPercent: 62.0,
    currentStock: 45,
    minStock: 20,
    status: 'active',
    history: [
      { id: 'h-1', type: 'sale', description: 'Venda Balcão #1025', quantityChange: -3, date: '08/09/2026' },
      { id: 'h-2', type: 'production', description: 'Entrada Fornada #LOT-260', quantityChange: 50, date: '08/09/2026' },
      { id: 'h-3', type: 'sale', description: 'Venda Corporativa #1024', quantityChange: -20, date: '08/09/2026' },
    ],
    priceHistory: [
      { id: 'ph-1', previousPrice: 9.0, newPrice: 10.0, date: '01/08/2026' },
    ],
  },
  {
    id: 'prod-2',
    code: 'BRW-BRANCO',
    name: 'Brownie Chocolate Branco',
    description: 'Massa amanteigada clássica recheada com pedaços generosos de chocolate branco nobre.',
    category: 'Brownies Tradicionais',
    unit: 'un',
    salePrice: 12.0,
    currentCost: 4.5,
    marginPercent: 62.5,
    currentStock: 12,
    minStock: 15,
    status: 'active',
    history: [
      { id: 'h-4', type: 'sale', description: 'Venda Balcão #1024', quantityChange: -15, date: '08/09/2026' },
      { id: 'h-5', type: 'production', description: 'Entrada Lote #LOT-258', quantityChange: 30, date: '07/09/2026' },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-3',
    code: 'BRW-NUT',
    name: 'Brownie Recheado Nutella',
    description: 'Brownie intenso com generosa camada central de creme de avelã autêntico Nutella.',
    category: 'Brownies Especiais',
    unit: 'un',
    salePrice: 14.0,
    currentCost: 5.8,
    marginPercent: 58.6,
    currentStock: 8,
    minStock: 15,
    status: 'active',
    history: [
      { id: 'h-6', type: 'sale', description: 'Venda Balcão #1022', quantityChange: -4, date: '07/09/2026' },
      { id: 'h-7', type: 'sale', description: 'Venda Balcão #1025', quantityChange: -2, date: '08/09/2026' },
    ],
    priceHistory: [
      { id: 'ph-2', previousPrice: 13.0, newPrice: 14.0, date: '15/07/2026' },
    ],
  },
  {
    id: 'prod-4',
    code: 'BRW-DOCE',
    name: 'Brownie Doce de Leite',
    description: 'Combinação perfeita de cacau 50% com recheio cremoso de doce de leite artesanal mineiro.',
    category: 'Brownies Especiais',
    unit: 'un',
    salePrice: 13.0,
    currentCost: 4.9,
    marginPercent: 62.3,
    currentStock: 24,
    minStock: 15,
    status: 'active',
    history: [
      { id: 'h-8', type: 'sale', description: 'Venda #1021', quantityChange: -6, date: '06/09/2026' },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-5',
    code: 'KIT-PRES-4',
    name: 'Caixa Presente (4 un)',
    description: 'Embalagem cartonada luxo com fita de cetim e 4 brownies tradicionais selecionados.',
    category: 'Kits & Caixas',
    unit: 'un',
    salePrice: 48.0,
    currentCost: 19.5,
    marginPercent: 59.4,
    currentStock: 5,
    minStock: 10,
    status: 'active',
    history: [
      { id: 'h-9', type: 'sale', description: 'Venda #1023', quantityChange: -10, date: '07/09/2026' },
      { id: 'h-10', type: 'production', description: 'Montagem de kits', quantityChange: 15, date: '05/09/2026' },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-6',
    code: 'FEST-CENTO',
    name: 'Mini Brownie Festa (Cento)',
    description: '100 mini brownies em porção individual para casamentos, aniversários e eventos corporativos.',
    category: 'Encomendas & Festas',
    unit: 'cento',
    salePrice: 280.0,
    currentCost: 112.0,
    marginPercent: 60.0,
    currentStock: 2,
    minStock: 1,
    status: 'active',
    history: [
      { id: 'h-11', type: 'sale', description: 'Venda #1020', quantityChange: -1, date: '07/09/2026' },
      { id: 'h-12', type: 'production', description: 'Fornada festa', quantityChange: 3, date: '06/09/2026' },
    ],
    priceHistory: [],
  },
  {
    id: 'prod-7',
    code: 'BRW-NOZES',
    name: 'Brownie de Nozes Chilenas',
    description: 'Edição de outono/inverno com pedaços tostados de nozes chilenas na massa.',
    category: 'Brownies Especiais',
    unit: 'un',
    salePrice: 15.0,
    currentCost: 6.2,
    marginPercent: 58.7,
    currentStock: 0,
    minStock: 10,
    status: 'inactive',
    notes: 'Temporariamente fora do cardápio até a safra de nozes.',
    history: [],
    priceHistory: [],
  },
];
