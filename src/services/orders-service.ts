import { OrderData, OrderStatus, MOCK_ORDERS_LIST } from '@/types/orders';

const ORDERS_STORAGE_KEY = 'veneza_orders_v1';

class OrdersService {
  private ordersCache: OrderData[] = [];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.ordersCache = parsed;
            this.isInitialized = true;
            return;
          }
        }
        // Seed inicial a partir de MOCK_ORDERS_LIST
        this.ordersCache = [...MOCK_ORDERS_LIST];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.ordersCache));
      } catch (err) {
        console.error('Erro ao ler pedidos do localStorage:', err);
        this.ordersCache = [...MOCK_ORDERS_LIST];
      }
    } else {
      this.ordersCache = [...MOCK_ORDERS_LIST];
    }

    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.ordersCache));
      } catch (err) {
        console.error('Erro ao persistir pedidos no localStorage:', err);
      }
    }
  }

  public getAll(): OrderData[] {
    this.initStorage();
    return [...this.ordersCache];
  }

  public getById(id: string): OrderData | undefined {
    this.initStorage();
    return this.ordersCache.find((o) => o.id === id);
  }

  public create(newOrder: OrderData): OrderData {
    this.initStorage();
    this.ordersCache = [newOrder, ...this.ordersCache];
    this.persist();
    return newOrder;
  }

  public update(updatedOrder: OrderData): OrderData {
    this.initStorage();
    this.ordersCache = this.ordersCache.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    this.persist();
    return updatedOrder;
  }

  public updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): { success: boolean; order?: OrderData; error?: string } {
    this.initStorage();
    const index = this.ordersCache.findIndex((o) => o.id === orderId);
    if (index === -1) {
      return { success: false, error: 'Pedido não encontrado.' };
    }

    const order = this.ordersCache[index];
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const statusLabels: Record<OrderStatus, string> = {
      new: 'Criado',
      confirmed: 'Confirmado',
      in_production: 'Em Produção',
      ready: 'Pronto para Entrega',
      delivered: 'Entregue ao Cliente',
      cancelled: 'Cancelado',
    };

    const updatedOrder: OrderData = {
      ...order,
      status: newStatus,
      history: [
        {
          id: `oh-${Date.now()}`,
          title: `Status alterado para ${statusLabels[newStatus]}`,
          description: note?.trim() || `Pedido avançou no fluxo operacional.`,
          timestamp,
        },
        ...order.history,
      ],
    };

    this.ordersCache[index] = updatedOrder;
    this.persist();

    return { success: true, order: updatedOrder };
  }

  public registerAdvance(
    orderId: string,
    amount: number
  ): { success: boolean; order?: OrderData; error?: string } {
    this.initStorage();
    const index = this.ordersCache.findIndex((o) => o.id === orderId);
    if (index === -1) {
      return { success: false, error: 'Pedido não encontrado.' };
    }

    const order = this.ordersCache[index];
    const safeAmount = Math.max(0, amount);
    const newAdvance = Number((order.advanceReceived + safeAmount).toFixed(2));
    const newRemaining = Number(Math.max(0, order.totalAmount - newAdvance).toFixed(2));

    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedOrder: OrderData = {
      ...order,
      advanceReceived: newAdvance,
      remainingBalance: newRemaining,
      history: [
        {
          id: `oh-${Date.now()}`,
          title: 'Adiantamento (Sinal) recebido',
          description: `Valor de R$ ${safeAmount.toFixed(2)} registrado. Saldo pendente: R$ ${newRemaining.toFixed(2)}.`,
          timestamp,
        },
        ...order.history,
      ],
    };

    this.ordersCache[index] = updatedOrder;
    this.persist();

    return { success: true, order: updatedOrder };
  }

  public cancel(orderId: string, reason?: string): { success: boolean; order?: OrderData; error?: string } {
    this.initStorage();
    const index = this.ordersCache.findIndex((o) => o.id === orderId);
    if (index === -1) {
      return { success: false, error: 'Pedido não encontrado.' };
    }

    const order = this.ordersCache[index];
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedOrder: OrderData = {
      ...order,
      status: 'cancelled',
      remainingBalance: 0,
      history: [
        {
          id: `oh-${Date.now()}`,
          title: 'Pedido cancelado',
          description: reason?.trim() ? `Motivo: ${reason.trim()}` : 'Pedido cancelado pelo cliente ou operador.',
          timestamp,
        },
        ...order.history,
      ],
    };

    this.ordersCache[index] = updatedOrder;
    this.persist();

    return { success: true, order: updatedOrder };
  }
}

export const ordersService = new OrdersService();
