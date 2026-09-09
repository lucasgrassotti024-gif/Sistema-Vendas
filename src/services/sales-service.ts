import { SaleData, MOCK_SALES_LIST } from '@/types/sales';

const SALES_STORAGE_KEY = 'veneza_sales_v1';

class SalesService {
  private salesCache: SaleData[] = [];
  private isInitialized = false;

  private initStorage(): void {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(SALES_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.salesCache = parsed;
            this.isInitialized = true;
            return;
          }
        }
        // Seed inicial a partir de MOCK_SALES_LIST
        this.salesCache = [...MOCK_SALES_LIST];
        localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(this.salesCache));
      } catch (err) {
        console.error('Erro ao ler vendas do localStorage:', err);
        this.salesCache = [...MOCK_SALES_LIST];
      }
    } else {
      this.salesCache = [...MOCK_SALES_LIST];
    }

    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(this.salesCache));
      } catch (err) {
        console.error('Erro ao persistir vendas no localStorage:', err);
      }
    }
  }

  public getAll(): SaleData[] {
    this.initStorage();
    return [...this.salesCache];
  }

  public getById(id: string): SaleData | undefined {
    this.initStorage();
    return this.salesCache.find((s) => s.id === id);
  }

  public create(newSale: SaleData): SaleData {
    this.initStorage();
    this.salesCache = [newSale, ...this.salesCache];
    this.persist();
    return newSale;
  }

  public update(updatedSale: SaleData): SaleData {
    this.initStorage();
    this.salesCache = this.salesCache.map((s) => (s.id === updatedSale.id ? updatedSale : s));
    this.persist();
    return updatedSale;
  }

  public registerPayment(
    saleId: string,
    amount: number,
    paymentMethod: string = 'PIX'
  ): { success: boolean; sale?: SaleData; error?: string } {
    this.initStorage();
    const index = this.salesCache.findIndex((s) => s.id === saleId);
    if (index === -1) {
      return { success: false, error: 'Venda não encontrada.' };
    }

    const sale = this.salesCache[index];
    if (sale.status === 'cancelled') {
      return { success: false, error: 'Não é possível receber pagamento de venda cancelada.' };
    }

    const safeAmount = Math.max(0, amount);
    const newAmountPaid = Number((sale.amountPaid + safeAmount).toFixed(2));
    const newRemaining = Number(Math.max(0, sale.totalAmount - newAmountPaid).toFixed(2));
    const newStatus = newRemaining === 0 ? 'paid' : 'partial';

    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedSale: SaleData = {
      ...sale,
      amountPaid: newAmountPaid,
      remainingBalance: newRemaining,
      status: newStatus,
      paymentMethod: sale.paymentMethod ? `${sale.paymentMethod} + ${paymentMethod}` : paymentMethod,
      history: [
        {
          id: `h-${Date.now()}`,
          title: newRemaining === 0 ? 'Pagamento integral quitado' : 'Pagamento parcial registrado',
          description: `Recebido R$ ${safeAmount.toFixed(2)} via ${paymentMethod}. Saldo restante: R$ ${newRemaining.toFixed(2)}.`,
          timestamp,
        },
        ...sale.history,
      ],
    };

    this.salesCache[index] = updatedSale;
    this.persist();

    return { success: true, sale: updatedSale };
  }

  public cancel(saleId: string, reason?: string): { success: boolean; sale?: SaleData; error?: string } {
    this.initStorage();
    const index = this.salesCache.findIndex((s) => s.id === saleId);
    if (index === -1) {
      return { success: false, error: 'Venda não encontrada.' };
    }

    const sale = this.salesCache[index];
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedSale: SaleData = {
      ...sale,
      status: 'cancelled',
      remainingBalance: 0,
      history: [
        {
          id: `h-${Date.now()}`,
          title: 'Venda cancelada',
          description: reason?.trim() ? `Motivo: ${reason.trim()}` : 'Venda estornada pelo operador.',
          timestamp,
        },
        ...sale.history,
      ],
    };

    this.salesCache[index] = updatedSale;
    this.persist();

    return { success: true, sale: updatedSale };
  }
}

export const salesService = new SalesService();
