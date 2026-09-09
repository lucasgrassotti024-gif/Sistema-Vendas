import { AppSettings, DEFAULT_SETTINGS } from '@/types/settings';

const SETTINGS_STORAGE_KEY = 'veneza_system_settings_v1';

class SettingsService {
  private settingsCache: AppSettings | null = null;

  public getSettings(): AppSettings {
    if (this.settingsCache) {
      return this.settingsCache;
    }

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Merge profundo com os padrões para garantir que novos campos existam
          this.settingsCache = {
            company: { ...DEFAULT_SETTINGS.company, ...parsed.company },
            preferences: { ...DEFAULT_SETTINGS.preferences, ...parsed.preferences },
            sales: { ...DEFAULT_SETTINGS.sales, ...parsed.sales },
            inventory: { ...DEFAULT_SETTINGS.inventory, ...parsed.inventory },
            notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
          };
          return this.settingsCache;
        }
      } catch (err) {
        console.error('Falha ao ler configurações do localStorage:', err);
      }
    }

    this.settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    return this.settingsCache!;
  }

  public saveSettings(updated: AppSettings): AppSettings {
    this.settingsCache = JSON.parse(JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settingsCache));
      } catch (err) {
        console.error('Falha ao persistir configurações no localStorage:', err);
      }
    }

    return this.settingsCache!;
  }

  /**
   * Restaura estritamente as configurações do sistema para os valores padrão,
   * SEM interferir ou apagar produtos, vendas, pedidos, compras, estoque ou financeiro.
   */
  public restoreDefaultSettings(): AppSettings {
    this.settingsCache = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settingsCache));
      } catch (err) {
        console.error('Falha ao restaurar configurações padrão no localStorage:', err);
      }
    }

    return this.settingsCache!;
  }

  /**
   * Limpeza de dados de demonstração/locais (apenas sob confirmação expressa).
   */
  public clearAllLocalOperationalData(): void {
    if (typeof window !== 'undefined') {
      const keysToClear = [
        'veneza_products_v1',
        'veneza_inventory_non_products_v1',
        'veneza_production_orders_v1',
        'veneza_purchases_v1',
        'veneza_suppliers_v1',
        'veneza_fin_transactions_v1',
        'veneza_fin_receivables_v1',
        'veneza_fin_payables_v1',
        'veneza_fin_advances_v1',
        'veneza_sales_v1',
        'veneza_orders_v1',
      ];

      keysToClear.forEach((k) => localStorage.removeItem(k));
    }
  }
}

export const settingsService = new SettingsService();
