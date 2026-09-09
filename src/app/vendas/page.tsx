'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { SalesSummaryCards } from '@/components/sales/sales-summary-cards';
import { SalesTable } from '@/components/sales/sales-table';
import { SaleDetailsDrawer } from '@/components/sales/sale-details-drawer';
import { NewSaleModal } from '@/components/sales/new-sale-modal';
import {
  MOCK_SALES_LIST,
  MOCK_SALES_SUMMARY,
  SaleData,
  SaleStatus,
  SalesSummaryMetrics,
} from '@/types/sales';
import { Search, Filter, Calendar } from 'lucide-react';

export default function SalesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sales, setSales] = useState<SaleData[]>(MOCK_SALES_LIST);
  const [selectedSale, setSelectedSale] = useState<SaleData | null>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // Filtragem combinada
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Busca
      const matchSearch =
        sale.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.customerPhone && sale.customerPhone.includes(searchTerm));

      // Status
      const matchStatus = statusFilter === 'all' || sale.status === statusFilter;

      // Período
      let matchPeriod = true;
      if (periodFilter === 'today') {
        matchPeriod = sale.date === '2026-09-08';
      }

      return matchSearch && matchStatus && matchPeriod;
    });
  }, [sales, searchTerm, statusFilter, periodFilter]);

  const handleCreatedSale = (newSale: SaleData) => {
    setSales([newSale, ...sales]);
  };

  // Métricas calculadas dinamicamente sobre as vendas carregadas
  const dynamicSalesMetrics: SalesSummaryMetrics = useMemo(() => {
    const todayStr = '2026-09-08';
    const activeSales = sales.filter((s) => s.status !== 'cancelled');
    const totalSold = activeSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalReceivable = activeSales.reduce((acc, curr) => acc + curr.remainingBalance, 0);

    return {
      salesTodayCount: sales.filter((s) => s.date === todayStr).length,
      salesPeriodCount: sales.length,
      totalSoldAmount: totalSold,
      totalReceivableAmount: totalReceivable,
    };
  }, [sales]);

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/vendas"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Vendas"
          description="Acompanhe as vendas realizadas e seus respectivos pagamentos."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Nova Venda',
            onClick: () => setIsNewSaleOpen(true),
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards dinâmicos */}
          <SalesSummaryCards metrics={dynamicSalesMetrics} />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, cliente ou telefone..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-start md:justify-end text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todos</option>
                  <option value="paid">Pago</option>
                  <option value="partial">Parcial</option>
                  <option value="pending">Pendente</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Period Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Período:
                </span>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todo o histórico</option>
                  <option value="today">Apenas hoje</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sales Table with Row Clicks */}
          <SalesTable
            sales={filteredSales}
            onSelectSale={(sale) => setSelectedSale(sale)}
          />
        </main>
      </div>

      {/* Sale Details Drawer */}
      <SaleDetailsDrawer
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />

      {/* New Sale Modal */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        onCreated={handleCreatedSale}
      />
    </div>
  );
}
