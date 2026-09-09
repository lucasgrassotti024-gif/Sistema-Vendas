'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  ShoppingBag,
  Truck,
  Package,
  Layers,
  Flame,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { reportsService, ReportPeriod } from '@/services/reports-service';
import { ReportSummaryCards } from '@/components/reports/report-summary-cards';
import { ReportCharts } from '@/components/reports/report-charts';
import { ReportSections } from '@/components/reports/report-sections';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

type ReportTab = 'vendas' | 'pedidos' | 'produtos' | 'estoque' | 'producao' | 'compras' | 'financeiro';

export default function RelatoriosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [activeTab, setActiveTab] = useState<ReportTab>('vendas');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Dados consolidados diretamente dos services existentes
  const globalMetrics = useMemo(() => reportsService.getGlobalMetrics(period), [period]);
  const productPerformance = useMemo(() => reportsService.getProductPerformance(), []);
  const clientSales = useMemo(() => reportsService.getClientSales(), []);
  const supplierPurchases = useMemo(() => reportsService.getSupplierPurchases(), []);
  const ordersMetrics = useMemo(() => reportsService.getOrdersMetrics(), []);
  const productionMetrics = useMemo(() => reportsService.getProductionMetrics(), []);
  const inventoryMetrics = useMemo(() => reportsService.getInventoryMetrics(), []);

  // 2. Filtro contextual por busca
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return productPerformance;
    const term = searchTerm.toLowerCase();
    return productPerformance.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  }, [productPerformance, searchTerm]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clientSales;
    return clientSales.filter((c) => c.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [clientSales, searchTerm]);

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return supplierPurchases;
    return supplierPurchases.filter((s) => s.supplierName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [supplierPurchases, searchTerm]);

  // 3. Exportação Simples CSV do relatório em visualização
  const handleExportReport = () => {
    let csvHeader = '';
    let csvRows: string[] = [];
    const dateStr = new Date().toISOString().split('T')[0];

    switch (activeTab) {
      case 'vendas':
      case 'produtos':
        csvHeader = 'ID;Produto;Categoria;Preço Venda;Custo;Margem (%);Unidades Vendidas;Faturamento Bruto;Estoque Atual';
        csvRows = filteredProducts.map(
          (p) =>
            `${p.id};"${p.name}";"${p.category}";${p.salePrice.toFixed(2)};${p.unitCost.toFixed(2)};${p.marginPercent.toFixed(1)}%;${p.unitsSold};${p.grossRevenue.toFixed(2)};${p.currentStock}`
        );
        break;
      case 'pedidos':
        csvHeader = 'Métrica de Pedidos;Quantidade';
        csvRows = [
          `Total de Pedidos;${ordersMetrics.totalOrders}`,
          `Entregues;${ordersMetrics.delivered}`,
          `Pendentes;${ordersMetrics.pending}`,
          `Em Produção;${ordersMetrics.inProduction}`,
          `Cancelados;${ordersMetrics.cancelled}`,
        ];
        break;
      case 'compras':
        csvHeader = 'Fornecedor;Total de Compras;Total Gasto (R$);Saldo a Pagar (R$)';
        csvRows = filteredSuppliers.map(
          (s) => `"${s.supplierName}";${s.purchasesCount};${s.totalSpent.toFixed(2)};${s.pendingAmount.toFixed(2)}`
        );
        break;
      case 'producao':
        csvHeader = 'Indicador de Produção;Valor';
        csvRows = [
          `Total de Ordens Registradas;${productionMetrics.totalOrders}`,
          `Ordens Concluídas;${productionMetrics.completedOrdersCount}`,
          `Unidades Produzidas;${productionMetrics.totalProducedUnits}`,
          `Unidades Perdidas;${productionMetrics.totalLostUnits}`,
          `Rendimento Médio Geral;${productionMetrics.averageYieldPercent}%`,
        ];
        break;
      case 'estoque':
        csvHeader = 'Indicador de Estoque;Valor';
        csvRows = [
          `Total de Itens Monitorados;${inventoryMetrics.totalItems}`,
          `Itens com Estoque Baixo;${inventoryMetrics.lowStockCount}`,
          `Itens sem Estoque;${inventoryMetrics.outOfStockCount}`,
          `Valor Total em Mercadorias;R$ ${inventoryMetrics.totalStockValue.toFixed(2)}`,
        ];
        break;
      case 'financeiro':
        csvHeader = 'Indicador Financeiro;Valor (R$)';
        csvRows = [
          `Faturamento (Vendas);${globalMetrics.grossBilling.toFixed(2)}`,
          `Entradas Realizadas (Caixa);${globalMetrics.financialInflows.toFixed(2)}`,
          `Saídas Liquidadas (Caixa);${globalMetrics.financialOutflows.toFixed(2)}`,
          `Resultado Financeiro (Caixa);${globalMetrics.financialResult.toFixed(2)}`,
          `Total a Receber;${globalMetrics.totalReceivables.toFixed(2)}`,
          `Total a Pagar;${globalMetrics.totalPayables.toFixed(2)}`,
        ];
        break;
    }

    const csvContent = '\uFEFF' + [csvHeader, ...csvRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_veneza_${activeTab}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs: { id: ReportTab; label: string; icon: any }[] = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingBag },
    { id: 'pedidos', label: 'Pedidos', icon: Truck },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'estoque', label: 'Estoque', icon: Layers },
    { id: 'producao', label: 'Produção', icon: Flame },
    { id: 'compras', label: 'Compras', icon: Truck },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/relatorios"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Padrão */}
        <Header
          title="Relatórios"
          description="Transforme os dados da operação em informações para tomada de decisão."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
          {/* HEADER DE CONTROLES DA PÁGINA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
                Painel Estratégico de Indicadores
              </h2>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Consolidação operacional de vendas, estoque, compras, produção e financeiro.
              </p>
            </div>

            {/* CONTROLES DO HEADER */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Seletor de Período */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
                <Calendar className="w-4 h-4 text-[#8c7f74] dark:text-[#8a7f75]" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                  className="bg-transparent text-xs font-semibold text-[#2a221b] dark:text-[#f5f0eb] focus:outline-hidden cursor-pointer"
                >
                  <option value="today">Hoje</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="all">Todo o Período</option>
                </select>
              </div>

              {/* Filtro de Busca */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
                <Filter className="w-3.5 h-3.5 text-[#8c7f74] dark:text-[#8a7f75]" />
                <input
                  type="text"
                  placeholder="Filtrar dados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] dark:placeholder-[#8a7f75] focus:outline-hidden w-28 sm:w-36"
                />
              </div>

              {/* Botão Exportar */}
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#235347] hover:bg-[#1b4339] text-white text-xs font-medium shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Exportar dados da visão atual em formato CSV"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* 1. INDICADORES PRINCIPAIS (DASHBOARD DO RELATÓRIO) */}
          <ReportSummaryCards metrics={globalMetrics} />

          {/* 2. GRÁFICOS ESTRATÉGICOS */}
          <ReportCharts products={productPerformance} />

          {/* 3. NAVEGAÇÃO POR ABAS DE RELATÓRIO */}
          <div className="border-b border-[#e5dfd3] dark:border-[#38322c]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#235347] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-[#716458] dark:text-[#a89d91] hover:text-[#2a221b] dark:hover:text-[#f5f0eb] hover:bg-[#faf6f0] dark:hover:bg-[#28231f]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. CONTEÚDO DO RELATÓRIO ATIVO */}
          <ReportSections
            activeTab={activeTab}
            products={filteredProducts}
            clients={filteredClients}
            suppliers={filteredSuppliers}
            ordersMetrics={ordersMetrics}
            productionMetrics={productionMetrics}
            inventoryMetrics={inventoryMetrics}
          />
        </main>
      </div>
    </div>
  );
}
