'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { OrdersSummaryCards } from '@/components/orders/orders-summary-cards';
import { OrdersTable } from '@/components/orders/orders-table';
import { OrderDetailsDrawer } from '@/components/orders/order-details-drawer';
import { NewOrderModal } from '@/components/orders/new-order-modal';
import {
  MOCK_ORDERS_LIST,
  MOCK_ORDERS_SUMMARY,
  OrderData,
  OrderStatus,
  OrdersSummaryMetrics,
} from '@/types/orders';
import { Search } from 'lucide-react';

export default function OrdersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>(MOCK_ORDERS_LIST);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // Filtragem combinada
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Busca por código, cliente ou telefone
      const matchSearch =
        ord.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ord.customerPhone && ord.customerPhone.includes(searchTerm));

      // Status
      const matchStatus = statusFilter === 'all' || ord.status === statusFilter;

      // Período
      let matchPeriod = true;
      if (periodFilter === 'today') {
        matchPeriod = ord.orderDate === '2026-09-08' || ord.deliveryDate === '2026-09-08';
      }

      return matchSearch && matchStatus && matchPeriod;
    });
  }, [orders, searchTerm, statusFilter, periodFilter]);

  const handleCreatedOrder = (newOrder: OrderData) => {
    setOrders([newOrder, ...orders]);
  };

  // Métricas calculadas dinamicamente sobre a lista de pedidos
  const dynamicSummaryMetrics: OrdersSummaryMetrics = useMemo(() => {
    const todayStr = '2026-09-08';
    return {
      ordersTodayCount: orders.filter((o) => o.orderDate === todayStr || o.deliveryDate === todayStr).length,
      ordersPendingCount: orders.filter((o) => o.status === 'new' || o.status === 'confirmed').length,
      ordersInProductionCount: orders.filter((o) => o.status === 'in_production').length,
      ordersToDeliverCount: orders.filter((o) => o.status === 'ready').length,
    };
  }, [orders]);

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/pedidos"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Pedidos"
          description="Gerencie pedidos, entregas e o andamento das solicitações dos clientes."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Novo Pedido',
            onClick: () => setIsNewOrderOpen(true),
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards dinâmicos */}
          <OrdersSummaryCards metrics={dynamicSummaryMetrics} />

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
                  <option value="new">Novo</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="in_production">Em Produção</option>
                  <option value="ready">Pronto</option>
                  <option value="delivered">Entregue</option>
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
                  <option value="today">Hoje (Pedido ou Entrega)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table with Row Clicks */}
          <OrdersTable
            orders={filteredOrders}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        </main>
      </div>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreated={handleCreatedOrder}
      />
    </div>
  );
}
