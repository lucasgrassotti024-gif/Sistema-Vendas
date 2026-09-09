export interface CompanySettings {
  companyName: string;
  tradeName: string;
  document: string; // CNPJ
  phone: string;
  email: string;
  instagram: string;
  address: string;
  city: string;
  state: string;
}

export interface SystemPreferences {
  currency: 'BRL';
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';
  numberFormat: 'pt-BR' | 'en-US';
  theme: 'light' | 'dark';
}

export interface SalesSettings {
  defaultOrderStatus: 'new' | 'confirmed' | 'in_production';
  maxDiscountPercent: number;
  requireAdvancePayment: boolean;
  defaultAdvancePercent: number;
}

export interface InventorySettings {
  enableLowStockAlert: boolean;
  defaultLowStockThreshold: number;
  preventNegativeStock: boolean;
}

export interface NotificationSettings {
  enableLowStockNotifications: boolean;
  enableReceivablesAlerts: boolean;
  enablePayablesAlerts: boolean;
  enableProductionAlerts: boolean;
}

export interface SystemInfo {
  version: string;
  environment: string;
  persistenceType: string;
  releaseDate: string;
}

export interface AppSettings {
  company: CompanySettings;
  preferences: SystemPreferences;
  sales: SalesSettings;
  inventory: InventorySettings;
  notifications: NotificationSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  company: {
    companyName: 'Veneza Brownies Alimentos Artesanais LTDA',
    tradeName: 'Veneza Brownies',
    document: '42.891.304/0001-92',
    phone: '(11) 98765-4321',
    email: 'contato@venezabrownies.com.br',
    instagram: '@venezabrownies',
    address: 'Rua das Confeitarias, 120 - Jardins',
    city: 'São Paulo',
    state: 'SP',
  },
  preferences: {
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'pt-BR',
    theme: 'light',
  },
  sales: {
    defaultOrderStatus: 'new',
    maxDiscountPercent: 15,
    requireAdvancePayment: true,
    defaultAdvancePercent: 50,
  },
  inventory: {
    enableLowStockAlert: true,
    defaultLowStockThreshold: 10,
    preventNegativeStock: true,
  },
  notifications: {
    enableLowStockNotifications: true,
    enableReceivablesAlerts: true,
    enablePayablesAlerts: true,
    enableProductionAlerts: true,
  },
};
