export type CustomerStatus = 'active' | 'inactive';

export interface CustomerHistoryItem {
  id: string;
  code: string;
  type: 'order' | 'sale';
  date: string;
  amount: number;
  status: string;
}

export interface CustomerFinancialPending {
  receivableCount: number;
  totalReceivable: number;
  overdueCount: number;
  situation: 'em_dia' | 'atencao' | 'inadimplente';
}

export interface CustomerData {
  id: string;
  name: string;
  document?: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  status: CustomerStatus;
  ordersCount: number;
  salesCount: number;
  totalPurchasedAmount: number;
  totalPaidAmount: number;
  totalReceivableAmount: number;
  lastOrderDate?: string;
  history: CustomerHistoryItem[];
  financial: CustomerFinancialPending;
}

export interface CustomersSummaryMetrics {
  totalCustomers: number;
  newCustomers: number;
  customersWithOrders: number;
  customersWithReceivables: number;
}

export const MOCK_CUSTOMERS_SUMMARY: CustomersSummaryMetrics = {
  totalCustomers: 48,
  newCustomers: 7,
  customersWithOrders: 26,
  customersWithReceivables: 9,
};

export const MOCK_CUSTOMERS_LIST: CustomerData[] = [
  {
    id: 'c2',
    name: 'Café da Vila (Mariana)',
    document: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    email: 'contato@cafedavila.com.br',
    notes: 'Cliente corporativo com entregas semanais às terças e sextas.',
    createdAt: '2026-06-12',
    status: 'active',
    ordersCount: 14,
    salesCount: 12,
    totalPurchasedAmount: 4850.0,
    totalPaidAmount: 4410.0,
    totalReceivableAmount: 440.0,
    lastOrderDate: '2026-09-07',
    financial: {
      receivableCount: 2,
      totalReceivable: 440.0,
      overdueCount: 0,
      situation: 'em_dia',
    },
    history: [
      { id: 'h-1', code: 'PED-102', type: 'order', date: '2026-09-07', amount: 480.0, status: 'Em Produção' },
      { id: 'h-2', code: 'VEN-1024', type: 'sale', date: '2026-09-08', amount: 260.0, status: 'Parcial' },
      { id: 'h-3', code: 'VEN-0998', type: 'sale', date: '2026-08-30', amount: 350.0, status: 'Pago' },
    ],
  },
  {
    id: 'c3',
    name: 'Boutique do Doce (Rodrigo)',
    document: '23.456.789/0001-01',
    phone: '(11) 97654-3210',
    email: 'pedidos@boutiquedodoce.com',
    notes: 'Encomendas de caixas especiais para revenda boutique.',
    createdAt: '2026-07-01',
    status: 'active',
    ordersCount: 9,
    salesCount: 8,
    totalPurchasedAmount: 3420.0,
    totalPaidAmount: 2970.0,
    totalReceivableAmount: 450.0,
    lastOrderDate: '2026-09-08',
    financial: {
      receivableCount: 1,
      totalReceivable: 450.0,
      overdueCount: 0,
      situation: 'em_dia',
    },
    history: [
      { id: 'h-4', code: 'PED-103', type: 'order', date: '2026-09-08', amount: 370.0, status: 'Pronto' },
      { id: 'h-5', code: 'VEN-1023', type: 'sale', date: '2026-09-07', amount: 450.0, status: 'Pendente' },
    ],
  },
  {
    id: 'c4',
    name: 'João Carlos Silva',
    document: '234.567.890-12',
    phone: '(11) 99123-4567',
    email: 'joao.silva@email.com',
    notes: 'Cliente fiel de balcão e encomendas para eventos de família.',
    createdAt: '2026-08-10',
    status: 'active',
    ordersCount: 4,
    salesCount: 5,
    totalPurchasedAmount: 840.0,
    totalPaidAmount: 600.0,
    totalReceivableAmount: 240.0,
    lastOrderDate: '2026-09-08',
    financial: {
      receivableCount: 1,
      totalReceivable: 240.0,
      overdueCount: 0,
      situation: 'em_dia',
    },
    history: [
      { id: 'h-6', code: 'PED-101', type: 'order', date: '2026-09-08', amount: 340.0, status: 'Confirmado' },
      { id: 'h-7', code: 'VEN-1022', type: 'sale', date: '2026-09-07', amount: 56.0, status: 'Pago' },
    ],
  },
  {
    id: 'c5',
    name: 'Ana Paula Medeiros',
    document: '345.678.901-23',
    phone: '(11) 98888-7777',
    email: 'anapaula@medeiros.adv.br',
    notes: 'Costuma encomendar centos de mini brownies para recepções.',
    createdAt: '2026-05-18',
    status: 'active',
    ordersCount: 6,
    salesCount: 6,
    totalPurchasedAmount: 1680.0,
    totalPaidAmount: 1680.0,
    totalReceivableAmount: 0.0,
    lastOrderDate: '2026-09-06',
    financial: {
      receivableCount: 0,
      totalReceivable: 0.0,
      overdueCount: 0,
      situation: 'em_dia',
    },
    history: [
      { id: 'h-8', code: 'PED-104', type: 'order', date: '2026-09-06', amount: 280.0, status: 'Entregue' },
    ],
  },
  {
    id: 'c6',
    name: 'Empório dos Sabores (Marcos)',
    document: '45.678.901/0001-34',
    phone: '(11) 97111-2222',
    email: 'compras@emporiosabores.com.br',
    notes: 'Possui título em atraso há mais de 10 dias.',
    createdAt: '2026-04-10',
    status: 'active',
    ordersCount: 8,
    salesCount: 7,
    totalPurchasedAmount: 2950.0,
    totalPaidAmount: 2460.0,
    totalReceivableAmount: 490.0,
    lastOrderDate: '2026-08-20',
    financial: {
      receivableCount: 1,
      totalReceivable: 490.0,
      overdueCount: 1,
      situation: 'inadimplente',
    },
    history: [
      { id: 'h-9', code: 'VEN-0940', type: 'sale', date: '2026-08-20', amount: 490.0, status: 'Pendente' },
    ],
  },
  {
    id: 'c7',
    name: 'Confeitaria Doce Mel',
    phone: '(11) 96555-4433',
    email: 'docemel@confeitaria.com',
    notes: 'Cadastro inativo por falta de pedidos nos últimos 90 dias.',
    createdAt: '2026-01-15',
    status: 'inactive',
    ordersCount: 2,
    salesCount: 2,
    totalPurchasedAmount: 420.0,
    totalPaidAmount: 420.0,
    totalReceivableAmount: 0.0,
    lastOrderDate: '2026-05-10',
    financial: {
      receivableCount: 0,
      totalReceivable: 0.0,
      overdueCount: 0,
      situation: 'em_dia',
    },
    history: [],
  },
];
