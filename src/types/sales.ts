export type SaleStatus = 'paid' | 'partial' | 'pending' | 'cancelled';

export interface SaleItemData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleEventHistory {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface SaleData {
  id: string;
  code: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItemData[];
  subtotalAmount: number;
  discountAmount: number;
  advanceAppliedAmount: number;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  status: SaleStatus;
  paymentMethod?: string;
  history: SaleEventHistory[];
  notes?: string;
}

export interface SalesSummaryMetrics {
  salesTodayCount: number;
  salesPeriodCount: number;
  totalSoldAmount: number;
  totalReceivableAmount: number;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

export const MOCK_CUSTOMERS: CustomerOption[] = [
  { id: 'c1', name: 'Consumidor Balcão', phone: '-' },
  { id: 'c2', name: 'Café da Vila (Mariana)', phone: '(11) 98765-4321' },
  { id: 'c3', name: 'Boutique do Doce (Rodrigo)', phone: '(11) 97654-3210' },
  { id: 'c4', name: 'João Carlos Silva', phone: '(11) 99123-4567' },
  { id: 'c5', name: 'Ana Paula Medeiros', phone: '(11) 98888-7777' },
];

export const MOCK_PRODUCTS: ProductOption[] = [
  { id: 'p1', name: 'Brownie Tradicional', price: 10.0, category: 'Brownies' },
  { id: 'p2', name: 'Brownie Chocolate Branco', price: 12.0, category: 'Brownies' },
  { id: 'p3', name: 'Brownie Recheado Nutella', price: 14.0, category: 'Brownies' },
  { id: 'p4', name: 'Brownie Doce de Leite', price: 13.0, category: 'Brownies' },
  { id: 'p5', name: 'Caixa Presente (4 un)', price: 48.0, category: 'Especiais' },
  { id: 'p6', name: 'Mini Brownie Festa (Cento)', price: 280.0, category: 'Encomendas' },
];

export const MOCK_SALES_SUMMARY: SalesSummaryMetrics = {
  salesTodayCount: 14,
  salesPeriodCount: 184,
  totalSoldAmount: 14850.0,
  totalReceivableAmount: 1620.0,
};

export const MOCK_SALES_LIST: SaleData[] = [
  {
    id: 's-1025',
    code: 'VEN-1025',
    date: '2026-09-08',
    customerId: 'c1',
    customerName: 'Consumidor Balcão',
    items: [
      { id: 'i1', productId: 'p1', productName: 'Brownie Tradicional', quantity: 3, unitPrice: 10.0, subtotal: 30.0 },
      { id: 'i2', productId: 'p3', productName: 'Brownie Recheado Nutella', quantity: 2, unitPrice: 14.0, subtotal: 28.0 },
    ],
    subtotalAmount: 58.0,
    discountAmount: 0.0,
    advanceAppliedAmount: 0.0,
    totalAmount: 58.0,
    amountPaid: 58.0,
    remainingBalance: 0.0,
    status: 'paid',
    paymentMethod: 'PIX',
    history: [
      { id: 'h1', title: 'Venda criada', description: 'Venda balcão faturada', timestamp: 'Hoje às 15:40' },
      { id: 'h2', title: 'Pagamento recebido', description: 'R$ 58,00 via PIX no caixa', timestamp: 'Hoje às 15:40' },
    ],
  },
  {
    id: 's-1024',
    code: 'VEN-1024',
    date: '2026-09-08',
    customerId: 'c2',
    customerName: 'Café da Vila (Mariana)',
    customerPhone: '(11) 98765-4321',
    items: [
      { id: 'i3', productId: 'p1', productName: 'Brownie Tradicional', quantity: 20, unitPrice: 10.0, subtotal: 200.0 },
      { id: 'i4', productId: 'p2', productName: 'Brownie Chocolate Branco', quantity: 15, unitPrice: 12.0, subtotal: 180.0 },
    ],
    subtotalAmount: 380.0,
    discountAmount: 20.0,
    advanceAppliedAmount: 100.0,
    totalAmount: 260.0,
    amountPaid: 100.0,
    remainingBalance: 160.0,
    status: 'partial',
    paymentMethod: 'Cartão + Faturado',
    history: [
      { id: 'h3', title: 'Venda faturada', description: 'Entrega de lote comercial', timestamp: 'Hoje às 14:15' },
      { id: 'h4', title: 'Sinal aplicado', description: 'R$ 100,00 de adiantamento abatido', timestamp: 'Hoje às 14:15' },
      { id: 'h5', title: 'Pagamento parcial', description: 'R$ 100,00 via Cartão Débito', timestamp: 'Hoje às 14:20' },
      { id: 'h6', title: 'Conta a Receber gerada', description: 'R$ 160,00 a vencer em 15/09', timestamp: 'Hoje às 14:20' },
    ],
  },
  {
    id: 's-1023',
    code: 'VEN-1023',
    date: '2026-09-07',
    customerId: 'c3',
    customerName: 'Boutique do Doce (Rodrigo)',
    customerPhone: '(11) 97654-3210',
    items: [
      { id: 'i5', productId: 'p5', productName: 'Caixa Presente (4 un)', quantity: 10, unitPrice: 48.0, subtotal: 480.0 },
    ],
    subtotalAmount: 480.0,
    discountAmount: 30.0,
    advanceAppliedAmount: 0.0,
    totalAmount: 450.0,
    amountPaid: 0.0,
    remainingBalance: 450.0,
    status: 'pending',
    history: [
      { id: 'h7', title: 'Venda faturada a prazo', description: 'Faturamento a 15 dias', timestamp: 'Ontem às 18:00' },
      { id: 'h8', title: 'Título gerado', description: 'R$ 450,00 com vencimento em 22/09', timestamp: 'Ontem às 18:00' },
    ],
  },
  {
    id: 's-1022',
    code: 'VEN-1022',
    date: '2026-09-07',
    customerId: 'c4',
    customerName: 'João Carlos Silva',
    items: [
      { id: 'i6', productId: 'p3', productName: 'Brownie Recheado Nutella', quantity: 4, unitPrice: 14.0, subtotal: 56.0 },
    ],
    subtotalAmount: 56.0,
    discountAmount: 0.0,
    advanceAppliedAmount: 0.0,
    totalAmount: 56.0,
    amountPaid: 56.0,
    remainingBalance: 0.0,
    status: 'paid',
    paymentMethod: 'Dinheiro',
    history: [
      { id: 'h9', title: 'Venda realizada', description: 'Atendimento presencial', timestamp: 'Ontem às 16:30' },
      { id: 'h10', title: 'Pagamento total', description: 'R$ 56,00 quitado no ato', timestamp: 'Ontem às 16:30' },
    ],
  },
  {
    id: 's-1021',
    code: 'VEN-1021',
    date: '2026-09-06',
    customerId: 'c5',
    customerName: 'Ana Paula Medeiros',
    items: [
      { id: 'i7', productId: 'p4', productName: 'Brownie Doce de Leite', quantity: 6, unitPrice: 13.0, subtotal: 78.0 },
    ],
    subtotalAmount: 78.0,
    discountAmount: 0.0,
    advanceAppliedAmount: 0.0,
    totalAmount: 78.0,
    amountPaid: 0.0,
    remainingBalance: 0.0,
    status: 'cancelled',
    notes: 'Cancelamento por desistência antes do envio.',
    history: [
      { id: 'h11', title: 'Venda criada', description: 'Pedido encomendado', timestamp: '06/09 às 11:00' },
      { id: 'h12', title: 'Venda cancelada', description: 'Cancelada pelo cliente e estoque estornado', timestamp: '06/09 às 11:45' },
    ],
  },
];
