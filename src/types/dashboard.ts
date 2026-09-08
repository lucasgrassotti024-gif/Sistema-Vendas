export interface MetricData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: 'DollarSign' | 'ShoppingBag' | 'Clock' | 'TrendingUp';
  accentColor: 'green' | 'blue' | 'gold' | 'brown';
}

export interface ActivityItem {
  id: string;
  type: 'sale' | 'order' | 'payment' | 'production' | 'stock';
  title: string;
  description: string;
  timestamp: string;
  value?: string;
  badgeText: string;
}

export interface SalesDayTrend {
  day: string;
  sales: number;
  orders: number;
}

export interface FinancialOverview {
  revenue: number;
  expenses: number;
  netProfit: number;
  marginPercent: number;
}

export const MOCK_METRICS: MetricData[] = [
  {
    title: 'Vendas Totais',
    value: 'R$ 14.850,00',
    change: '+14,2%',
    isPositive: true,
    comparisonText: 'vs. semana anterior',
    iconName: 'DollarSign',
    accentColor: 'green',
  },
  {
    title: 'Pedidos Realizados',
    value: '184 un',
    change: '+8,5%',
    isPositive: true,
    comparisonText: 'vs. semana anterior',
    iconName: 'ShoppingBag',
    accentColor: 'blue',
  },
  {
    title: 'Contas a Receber',
    value: 'R$ 1.620,00',
    change: '-3,8%',
    isPositive: true,
    comparisonText: 'inadimplência reduzida',
    iconName: 'Clock',
    accentColor: 'gold',
  },
  {
    title: 'Lucro Estimado',
    value: 'R$ 8.940,00',
    change: '+16,1%',
    isPositive: true,
    comparisonText: 'margem líquida de 60,2%',
    iconName: 'TrendingUp',
    accentColor: 'brown',
  },
];

export const MOCK_SALES_TREND: SalesDayTrend[] = [
  { day: 'Seg', sales: 1450, orders: 18 },
  { day: 'Ter', sales: 1820, orders: 22 },
  { day: 'Qua', sales: 2100, orders: 27 },
  { day: 'Qui', sales: 1980, orders: 24 },
  { day: 'Sex', sales: 3200, orders: 41 },
  { day: 'Sáb', sales: 2850, orders: 36 },
  { day: 'Dom', sales: 1450, orders: 16 },
];

export const MOCK_FINANCIAL: FinancialOverview = {
  revenue: 14850.00,
  expenses: 5910.00,
  netProfit: 8940.00,
  marginPercent: 60.2,
};

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Venda Balcão #1042',
    description: '4x Brownie Tradicional, 2x Nutella',
    timestamp: 'Há 8 min',
    value: 'R$ 68,00',
    badgeText: 'Concluída',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Recebimento PIX',
    description: 'Quitação parcial — Café da Vila',
    timestamp: 'Há 25 min',
    value: 'R$ 250,00',
    badgeText: 'Quitado',
  },
  {
    id: '3',
    type: 'production',
    title: 'Lote de Fornada #LOT-260',
    description: '50 unidades de Brownie Meio Amargo concluídas',
    timestamp: 'Há 1h',
    badgeText: 'Produção',
  },
  {
    id: '4',
    type: 'order',
    title: 'Nova Encomenda #PED-089',
    description: 'Casamento Mariana — 120 Mini Brownies',
    timestamp: 'Há 2h',
    value: 'R$ 480,00',
    badgeText: 'Confirmado',
  },
  {
    id: '5',
    type: 'stock',
    title: 'Entrada de Insumos',
    description: 'Compra Fornecedor Callebaut — 15 kg Chocolate',
    timestamp: 'Há 3h',
    value: 'R$ 720,00',
    badgeText: 'Estoque',
  },
];
