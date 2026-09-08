export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'in_production'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  quantityOrdered: number;
  quantityDelivered: number;
  quantityRemaining: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderEventHistory {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface OrderData {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  orderDate: string;
  deliveryDate: string;
  items: OrderItemData[];
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  advanceReceived: number;
  advanceApplied: number;
  remainingBalance: number;
  status: OrderStatus;
  notes?: string;
  history: OrderEventHistory[];
}

export interface OrdersSummaryMetrics {
  ordersTodayCount: number;
  ordersPendingCount: number;
  ordersInProductionCount: number;
  ordersToDeliverCount: number;
}

export const MOCK_ORDERS_SUMMARY: OrdersSummaryMetrics = {
  ordersTodayCount: 8,
  ordersPendingCount: 5,
  ordersInProductionCount: 4,
  ordersToDeliverCount: 3,
};

export const MOCK_ORDERS_LIST: OrderData[] = [
  {
    id: 'ord-101',
    code: 'PED-101',
    customerId: 'c4',
    customerName: 'João Carlos Silva',
    customerPhone: '(11) 99123-4567',
    orderDate: '2026-09-08',
    deliveryDate: '2026-09-09',
    items: [
      {
        id: 'oi-1',
        productId: 'p1',
        productName: 'Brownie Tradicional',
        quantityOrdered: 20,
        quantityDelivered: 0,
        quantityRemaining: 20,
        unitPrice: 10.0,
        subtotal: 200.0,
      },
      {
        id: 'oi-2',
        productId: 'p3',
        productName: 'Brownie Recheado Nutella',
        quantityOrdered: 10,
        quantityDelivered: 0,
        quantityRemaining: 10,
        unitPrice: 14.0,
        subtotal: 140.0,
      },
    ],
    subtotalAmount: 340.0,
    discountAmount: 0.0,
    totalAmount: 340.0,
    advanceReceived: 100.0,
    advanceApplied: 0.0,
    remainingBalance: 240.0,
    status: 'confirmed',
    notes: 'Entregar na recepção do condomínio às 14h.',
    history: [
      { id: 'oh-1', title: 'Pedido criado', description: 'Registrado via WhatsApp', timestamp: 'Hoje às 09:30' },
      { id: 'oh-2', title: 'Sinal recebido', description: 'R$ 100,00 via PIX', timestamp: 'Hoje às 09:45' },
      { id: 'oh-3', title: 'Pedido confirmado', description: 'Agendado para produção', timestamp: 'Hoje às 10:00' },
    ],
  },
  {
    id: 'ord-102',
    code: 'PED-102',
    customerId: 'c2',
    customerName: 'Café da Vila (Mariana)',
    customerPhone: '(11) 98765-4321',
    orderDate: '2026-09-07',
    deliveryDate: '2026-09-08',
    items: [
      {
        id: 'oi-3',
        productId: 'p1',
        productName: 'Brownie Tradicional',
        quantityOrdered: 50,
        quantityDelivered: 30,
        quantityRemaining: 20,
        unitPrice: 10.0,
        subtotal: 500.0,
      },
    ],
    subtotalAmount: 500.0,
    discountAmount: 20.0,
    totalAmount: 480.0,
    advanceReceived: 200.0,
    advanceApplied: 200.0,
    remainingBalance: 280.0,
    status: 'in_production',
    notes: 'Primeiro lote de 30 unidades já entregue. Lote restante de 20 un em forno.',
    history: [
      { id: 'oh-4', title: 'Pedido criado', description: 'Pedido corporativo semanal', timestamp: 'Ontem às 11:00' },
      { id: 'oh-5', title: 'Adiantamento recebido', description: 'R$ 200,00 confirmado', timestamp: 'Ontem às 11:15' },
      { id: 'oh-6', title: 'Entrega parcial', description: 'Venda #1024 faturou 30 brownies', timestamp: 'Hoje às 14:15' },
      { id: 'oh-7', title: 'Entrou em produção', description: 'Restante de 20 brownies no forno', timestamp: 'Hoje às 15:30' },
    ],
  },
  {
    id: 'ord-103',
    code: 'PED-103',
    customerId: 'c3',
    customerName: 'Boutique do Doce (Rodrigo)',
    customerPhone: '(11) 97654-3210',
    orderDate: '2026-09-08',
    deliveryDate: '2026-09-08',
    items: [
      {
        id: 'oi-4',
        productId: 'p5',
        productName: 'Caixa Presente (4 un)',
        quantityOrdered: 8,
        quantityDelivered: 0,
        quantityRemaining: 8,
        unitPrice: 48.0,
        subtotal: 384.0,
      },
    ],
    subtotalAmount: 384.0,
    discountAmount: 14.0,
    totalAmount: 370.0,
    advanceReceived: 370.0,
    advanceApplied: 0.0,
    remainingBalance: 0.0,
    status: 'ready',
    notes: 'Cliente vem retirar às 17:30.',
    history: [
      { id: 'oh-8', title: 'Pedido criado', description: 'Pagamento total antecipado', timestamp: 'Hoje às 10:20' },
      { id: 'oh-9', title: 'Produção concluída', description: 'Lote embalado com laço dourado', timestamp: 'Hoje às 15:00' },
      { id: 'oh-10', title: 'Status Pronto', description: 'Aguardando retirada no balcão', timestamp: 'Hoje às 15:05' },
    ],
  },
  {
    id: 'ord-104',
    code: 'PED-104',
    customerId: 'c5',
    customerName: 'Ana Paula Medeiros',
    customerPhone: '(11) 98888-7777',
    orderDate: '2026-09-06',
    deliveryDate: '2026-09-07',
    items: [
      {
        id: 'oi-5',
        productId: 'p6',
        productName: 'Mini Brownie Festa (Cento)',
        quantityOrdered: 1,
        quantityDelivered: 1,
        quantityRemaining: 0,
        unitPrice: 280.0,
        subtotal: 280.0,
      },
    ],
    subtotalAmount: 280.0,
    discountAmount: 0.0,
    totalAmount: 280.0,
    advanceReceived: 100.0,
    advanceApplied: 100.0,
    remainingBalance: 0.0,
    status: 'delivered',
    notes: 'Aniversário infantil.',
    history: [
      { id: 'oh-11', title: 'Pedido criado', description: 'Reserva antecipada', timestamp: '06/09 às 14:00' },
      { id: 'oh-12', title: 'Produção finalizada', description: 'Cento de mini brownies concluído', timestamp: '07/09 às 10:00' },
      { id: 'oh-13', title: 'Entregue com sucesso', description: 'Venda faturada e quitada', timestamp: '07/09 às 16:30' },
    ],
  },
  {
    id: 'ord-105',
    code: 'PED-105',
    customerId: 'c4',
    customerName: 'João Carlos Silva',
    orderDate: '2026-09-08',
    deliveryDate: '2026-09-12',
    items: [
      {
        id: 'oi-6',
        productId: 'p2',
        productName: 'Brownie Chocolate Branco',
        quantityOrdered: 12,
        quantityDelivered: 0,
        quantityRemaining: 12,
        unitPrice: 12.0,
        subtotal: 144.0,
      },
    ],
    subtotalAmount: 144.0,
    discountAmount: 0.0,
    totalAmount: 144.0,
    advanceReceived: 0.0,
    advanceApplied: 0.0,
    remainingBalance: 144.0,
    status: 'new',
    notes: 'Aguardando confirmação de sinal.',
    history: [
      { id: 'oh-14', title: 'Pedido recebido', description: 'Solicitação em análise', timestamp: 'Hoje às 15:50' },
    ],
  },
];
