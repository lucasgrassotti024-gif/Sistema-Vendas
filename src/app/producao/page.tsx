'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { ProductionSummaryCards } from '@/components/production/production-summary-cards';
import { ProductionTable } from '@/components/production/production-table';
import { ProductionDetailsDrawer } from '@/components/production/production-details-drawer';
import { NewProductionModal } from '@/components/production/new-production-modal';
import { FinalizeProductionModal } from '@/components/production/finalize-production-modal';
import { ProductionOrder, ProductionStatus } from '@/types/production';
import { productionService } from '@/services/production-service';
import { Search } from 'lucide-react';

export default function ProducaoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const [orderToFinalize, setOrderToFinalize] = useState<ProductionOrder | null>(null);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const loadOrders = useCallback(() => {
    const list = productionService.getAll();
    setOrders(list);

    if (selectedOrder) {
      const refreshed = list.find((o) => o.id === selectedOrder.id) || null;
      setSelectedOrder(refreshed);
    }
  }, [selectedOrder]);

  useEffect(() => {
    loadOrders();
  }, []);

  const summaryMetrics = useMemo(() => {
    return productionService.calculateSummary(orders);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || ord.status === statusFilter;

      let matchPeriod = true;
      if (periodFilter === 'today') {
        matchPeriod = ord.scheduledDate === '08/09/2026';
      } else if (periodFilter === 'week') {
        matchPeriod = true; // Dados do período de teste
      }

      return matchSearch && matchStatus && matchPeriod;
    });
  }, [orders, searchTerm, statusFilter, periodFilter]);

  const handleOpenNewOrder = () => {
    setIsNewOrderModalOpen(true);
  };

  const handleOpenFinalize = (order: ProductionOrder) => {
    setOrderToFinalize(order);
    setIsFinalizeModalOpen(true);
  };

  const handleNewOrderSuccess = (newOrder: ProductionOrder) => {
    loadOrders();
    setSelectedOrder(newOrder);
  };

  const handleFinalizeSuccess = (updatedOrder: ProductionOrder) => {
    loadOrders();
    if (selectedOrder && selectedOrder.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/producao"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Produção"
          description="Planeje a produção, acompanhe ordens e controle o que foi produzido."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Nova Produção',
            onClick: handleOpenNewOrder,
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards */}
          <ProductionSummaryCards metrics={summaryMetrics} />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nº da ordem, produto ou responsável..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            {/* Filter Selects */}
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
                  <option value="all">Todos os Status</option>
                  <option value="scheduled">Programada</option>
                  <option value="in_production">Em Produção</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              {/* Período Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Período:
                </span>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todo o Período</option>
                  <option value="today">Hoje (08/09)</option>
                  <option value="week">Esta Semana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Ordens de Produção */}
          <ProductionTable
            orders={filteredOrders}
            onSelectOrder={(order) => setSelectedOrder(order)}
            onFinalizeOrder={(order) => handleOpenFinalize(order)}
          />
        </main>
      </div>

      {/* Drawer de Detalhes da Ordem */}
      <ProductionDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOpenFinalize={(order) => {
          setSelectedOrder(null);
          handleOpenFinalize(order);
        }}
      />

      {/* Modal Nova Produção */}
      <NewProductionModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSuccess={handleNewOrderSuccess}
      />

      {/* Modal Finalizar Produção */}
      <FinalizeProductionModal
        isOpen={isFinalizeModalOpen}
        onClose={() => {
          setIsFinalizeModalOpen(false);
          setOrderToFinalize(null);
        }}
        onSuccess={handleFinalizeSuccess}
        order={orderToFinalize}
      />
    </div>
  );
}
