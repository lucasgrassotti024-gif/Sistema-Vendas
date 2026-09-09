'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useTheme } from '@/components/theme-provider';
import { settingsService } from '@/services/settings-service';
import { AppSettings, DEFAULT_SETTINGS } from '@/types/settings';
import {
  Building2,
  Sliders,
  ShoppingBag,
  Layers,
  Bell,
  Database,
  RotateCcw,
  Check,
  AlertTriangle,
  Save,
  Moon,
  Sun,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Feedbacks visuais
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modais de confirmação
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [clearConfirmationText, setClearConfirmationText] = useState('');

  // Tema global
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loaded = settingsService.getSettings();
    setSettings(loaded);
    setIsLoaded(true);
  }, []);

  const handleSaveSection = (sectionName: string, updatedSettings: AppSettings) => {
    setIsSaving(true);
    const saved = settingsService.saveSettings(updatedSettings);
    setSettings(saved);

    setTimeout(() => {
      setIsSaving(false);
      setSavedSection(sectionName);
      setTimeout(() => setSavedSection(null), 3000);
    }, 300);
  };

  const handleRestoreDefaults = () => {
    const restored = settingsService.restoreDefaultSettings();
    setSettings(restored);
    setShowRestoreModal(false);
    setSavedSection('Restaurado');
    setTimeout(() => setSavedSection(null), 3000);
  };

  const handleClearAllOperationalData = () => {
    if (clearConfirmationText.trim().toUpperCase() !== 'LIMPAR DADOS') {
      return;
    }
    settingsService.clearAllLocalOperationalData();
    setShowClearDataModal(false);
    setClearConfirmationText('');
    alert('Os dados operacionais de demonstração locais foram redefinidos para os valores padrão.');
    window.location.reload();
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f0] dark:bg-[#151311]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#235347]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/configuracoes"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Padrão */}
        <Header
          title="Configurações"
          description="Centralize os parâmetros da empresa, preferências e regras do sistema."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto pb-16">
          {/* Alerta de Feedback Global */}
          {savedSection && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs font-semibold animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Configurações de {savedSection} salvas com sucesso!</span>
              </div>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider font-bold">
                Salvo no Navegador
              </span>
            </div>
          )}

          {/* 1. SEÇÃO EMPRESA */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Dados da Empresa
                  </h3>
                  <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                    Informações institucionais exibidas em recibos, pedidos e relatórios.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveSection('Empresa', settings)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Empresa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Razão Social
                </label>
                <input
                  type="text"
                  value={settings.company.companyName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, companyName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={settings.company.tradeName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, tradeName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={settings.company.document}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, document: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.company.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  E-mail Comercial
                </label>
                <input
                  type="email"
                  value={settings.company.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Instagram
                </label>
                <input
                  type="text"
                  value={settings.company.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, instagram: e.target.value },
                    })
                  }
                  placeholder="@venezabrownies"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={settings.company.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company: { ...settings.company, address: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. PREFERÊNCIAS DO SISTEMA */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Preferências do Sistema
                  </h3>
                  <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                    Formatação de valores, datas e aparência da interface.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveSection('Preferências', settings)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Preferências</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Moeda Padrão
                </label>
                <select
                  value={settings.preferences.currency}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-neutral-100 dark:bg-[#282420] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium cursor-not-allowed opacity-90"
                >
                  <option value="BRL">Real Brasileiro — BRL (R$)</option>
                </select>
                <p className="mt-1 text-[11px] text-[#8c7f74]">
                  Padronizado para as operações comerciais da Veneza Brownies.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Formato de Data
                </label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        dateFormat: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium cursor-pointer"
                >
                  <option value="DD/MM/YYYY">DD/MM/AAAA (08/09/2026)</option>
                  <option value="YYYY-MM-DD">AAAA-MM-DD (2026-09-08)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Formato Numérico
                </label>
                <select
                  value={settings.preferences.numberFormat}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        numberFormat: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium cursor-pointer"
                >
                  <option value="pt-BR">Padrão Brasil (1.234,56)</option>
                  <option value="en-US">Padrão Internacional (1,234.56)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Tema da Interface
                </label>
                <div className="flex items-center gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme === 'dark') toggleTheme();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                      theme === 'light'
                        ? 'border-[#235347] bg-[#e9f1ee] text-[#235347] font-bold shadow-xs'
                        : 'border-[#e5dfd3] dark:border-[#38322c] text-[#8c7f74] hover:bg-neutral-100 dark:hover:bg-[#282420]'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (theme === 'light') toggleTheme();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'border-[#377d6c] bg-[#192723] text-emerald-400 font-bold shadow-xs'
                        : 'border-[#e5dfd3] dark:border-[#38322c] text-[#8c7f74] hover:bg-neutral-100 dark:hover:bg-[#282420]'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-amber-400" />
                    <span>Escuro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. VENDAS E PEDIDOS */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Vendas e Pedidos
                  </h3>
                  <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                    Parâmetros padrão para emissão de pedidos e limites comerciais.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveSection('Vendas', settings)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Vendas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Status Inicial de Novos Pedidos
                </label>
                <select
                  value={settings.sales.defaultOrderStatus}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sales: {
                        ...settings.sales,
                        defaultOrderStatus: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium cursor-pointer"
                >
                  <option value="new">Novo (Aguardando Aprovação)</option>
                  <option value="confirmed">Confirmado Diretamente</option>
                  <option value="in_production">Encaminhar Direto para Produção</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Limite Máximo de Desconto (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.sales.maxDiscountPercent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sales: {
                          ...settings.sales,
                          maxDiscountPercent: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7f74] font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] mb-1.5">
                  Sinal / Adiantamento Padrão (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.sales.defaultAdvancePercent}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sales: {
                          ...settings.sales,
                          defaultAdvancePercent: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/30 outline-hidden font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7f74] font-bold">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-[#2a221b] dark:text-[#f5f0eb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sales.requireAdvancePayment}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sales: {
                        ...settings.sales,
                        requireAdvancePayment: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[#235347] focus:ring-[#235347] w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">
                  Exigir adiantamento financeiro para pedidos sob encomenda
                </span>
              </label>
              <p className="ml-6 text-[11px] text-[#8c7f74]">
                Registra automaticamente o título em Contas a Receber na data agendada.
              </p>
            </div>
          </div>

          {/* 4. ESTOQUE */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Estoque e Reposição
                  </h3>
                  <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                    Diretrizes de ponto de reposição e integridade de saldos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveSection('Estoque', settings)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Estoque</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <div>
                  <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Alertas Visuais de Estoque Baixo
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75] mt-0.5">
                    Destaca na tabela e no dashboard itens que atingirem o nível mínimo.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inventory.enableLowStockAlert}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inventory: {
                        ...settings.inventory,
                        enableLowStockAlert: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[#235347] focus:ring-[#235347] w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <div>
                  <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Limite Padrão para Estoque Mínimo
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75] mt-0.5">
                    Quantidade de segurança aplicada quando o produto não possuir estoque mínimo específico.
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    min="1"
                    value={settings.inventory.defaultLowStockThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        inventory: {
                          ...settings.inventory,
                          defaultLowStockThreshold: Math.max(1, Number(e.target.value)),
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                      Impedir Estoque Negativo
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75] mt-0.5">
                    Bloqueia saídas e baixas manuais que excedam o saldo físico disponível.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inventory.preventNegativeStock}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      inventory: {
                        ...settings.inventory,
                        preventNegativeStock: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[#235347] focus:ring-[#235347] w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 5. NOTIFICAÇÕES */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    Notificações e Avisos
                  </h3>
                  <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                    Configure quais alertas devem ser disparados pelo sino de notificações.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSaveSection('Notificações', settings)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Notificações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] hover:bg-[#faf6f0] dark:hover:bg-[#23201c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableLowStockNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableLowStockNotifications: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 rounded text-[#235347] focus:ring-[#235347] w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                    Avisos de Estoque Crítico
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                    Alerta quando ingredientes ou brownies chegarem ao nível de reposição.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] hover:bg-[#faf6f0] dark:hover:bg-[#23201c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableReceivablesAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableReceivablesAlerts: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 rounded text-[#235347] focus:ring-[#235347] w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                    Contas a Receber Vencendo
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                    Notifica sobre recebimentos previstos para hoje ou em atraso.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] hover:bg-[#faf6f0] dark:hover:bg-[#23201c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.enablePayablesAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enablePayablesAlerts: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 rounded text-[#235347] focus:ring-[#235347] w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                    Contas a Pagar Vencendo
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                    Lembretes de pagamentos de fornecedores e faturas do dia.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] hover:bg-[#faf6f0] dark:hover:bg-[#23201c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableProductionAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableProductionAlerts: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 rounded text-[#235347] focus:ring-[#235347] w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                    Ordens de Produção em Atraso
                  </span>
                  <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                    Sinaliza fornadas e lotes programados que ultrapassaram o horário.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 6. DADOS E SISTEMA */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Dados e Sistema
                </h3>
                <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                  Status da versão atual, arquitetura de persistência e gerenciamento do cache local.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <span className="text-[11px] font-semibold text-[#8c7f74] uppercase tracking-wider block mb-1">
                  Versão do Sistema
                </span>
                <span className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  v1.0.0 (Release Gestão)
                </span>
                <p className="text-[11px] text-[#8c7f74] mt-0.5">Build Estável Next.js</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <span className="text-[11px] font-semibold text-[#8c7f74] uppercase tracking-wider block mb-1">
                  Camada de Persistência
                </span>
                <span className="text-sm font-bold text-[#235347] dark:text-emerald-400">
                  Armazenamento Local Ativo
                </span>
                <p className="text-[11px] text-[#8c7f74] mt-0.5">
                  Persistência via localStorage do cliente
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
                <span className="text-[11px] font-semibold text-[#8c7f74] uppercase tracking-wider block mb-1">
                  Ambiente Operacional
                </span>
                <span className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Produção Local / Web
                </span>
                <p className="text-[11px] text-[#8c7f74] mt-0.5">Seguro e isolado</p>
              </div>
            </div>

            {/* Aviso Informativo sobre a persistência */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Persistência Operacional Ativa</p>
                <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                  Os dados operacionais de Produtos, Estoque, Produção, Compras e Financeiro são armazenados no navegador através dos serviços modulares da Veneza Brownies. Nenhuma conexão com servidor remoto é efetuada nesta etapa, preservando total privacidade e rapidez.
                </p>
              </div>
            </div>

            {/* Botão de Limpeza com Confirmação Rigorosa */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
              <div>
                <span className="font-bold text-xs text-rose-800 dark:text-rose-300">
                  Redefinir Dados Locais de Demonstração
                </span>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                  Restaura os dados operacionais (produtos, compras, estoque e lançamentos) para o estado de fábrica.
                </p>
              </div>

              <button
                onClick={() => setShowClearDataModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Limpar Dados Locais
              </button>
            </div>
          </div>

          {/* 7. AÇÕES ADMINISTRATIVAS */}
          <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-[#e5dfd3] dark:border-[#38322c] pb-4">
              <div className="p-2.5 rounded-xl bg-stone-500/10 text-stone-600 dark:text-stone-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Ações Administrativas
                </h3>
                <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                  Restauração segura de preferências e configurações padrão.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f0] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
              <div>
                <span className="font-bold text-xs text-[#2a221b] dark:text-[#f5f0eb]">
                  Restaurar Configurações Padrão
                </span>
                <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75] mt-0.5">
                  Restaura apenas este painel de configurações para os valores de fábrica da Veneza Brownies. <strong>NUNCA apaga</strong> produtos, clientes, vendas, pedidos, compras, produção, estoque ou lançamentos financeiros.
                </p>
              </div>

              <button
                onClick={() => setShowRestoreModal(true)}
                className="px-4 py-2 rounded-xl border border-[#235347] text-[#235347] dark:text-emerald-400 dark:border-emerald-700/60 hover:bg-[#235347]/10 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Restaurar Padrões
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE CONFIRMAÇÃO: RESTAURAR CONFIGURAÇÕES */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Restaurar Configurações?
              </h4>
            </div>

            <p className="text-xs text-[#63574d] dark:text-[#c4b9ae] leading-relaxed">
              Tem certeza que deseja redefinir as preferências e parâmetros para o padrão da Veneza Brownies?
            </p>

            <div className="p-3 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] text-[11px] font-semibold">
              ✓ Seus produtos, clientes, pedidos, compras, estoque e financeiro NÃO serão afetados.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-xs font-semibold text-[#63574d] dark:text-[#c4b9ae] hover:bg-neutral-100 dark:hover:bg-[#282420] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar Restauração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO: LIMPAR DADOS LOCAIS */}
      {showClearDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#ffffff] dark:bg-[#1e1b18] border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Atenção: Limpeza de Dados
              </h4>
            </div>

            <p className="text-xs text-[#63574d] dark:text-[#c4b9ae] leading-relaxed">
              Esta ação reiniciará todas as listas de produtos, movimentações de estoque, produções, compras e transações financeiras para os dados padrão iniciais da aplicação.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Digite exatamente <span className="underline">LIMPAR DADOS</span> para confirmar:
              </label>
              <input
                type="text"
                placeholder="LIMPAR DADOS"
                value={clearConfirmationText}
                onChange={(e) => setClearConfirmationText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 font-bold outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowClearDataModal(false);
                  setClearConfirmationText('');
                }}
                className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-xs font-semibold text-[#63574d] dark:text-[#c4b9ae] hover:bg-neutral-100 dark:hover:bg-[#282420] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAllOperationalData}
                disabled={clearConfirmationText.trim().toUpperCase() !== 'LIMPAR DADOS'}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-all ${
                  clearConfirmationText.trim().toUpperCase() === 'LIMPAR DADOS'
                    ? 'bg-rose-700 hover:bg-rose-800 cursor-pointer active:scale-95'
                    : 'bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed opacity-60'
                }`}
              >
                Confirmar Limpeza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
