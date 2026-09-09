'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { CustomersSummaryCards } from '@/components/customers/customers-summary-cards';
import { CustomersTable } from '@/components/customers/customers-table';
import { CustomerDetailsDrawer } from '@/components/customers/customer-details-drawer';
import { NewCustomerModal } from '@/components/customers/new-customer-modal';
import {
  MOCK_CUSTOMERS_LIST,
  MOCK_CUSTOMERS_SUMMARY,
  CustomerData,
  CustomersSummaryMetrics,
} from '@/types/customers';
import { Search } from 'lucide-react';

export default function CustomersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerData[]>(MOCK_CUSTOMERS_LIST);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtragem combinada
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.document && c.document.includes(searchTerm));

      const matchStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleCreatedCustomer = (newCustomer: CustomerData) => {
    setCustomers([newCustomer, ...customers]);
  };

  // Métricas calculadas dinamicamente
  const dynamicCustomerMetrics: CustomersSummaryMetrics = useMemo(() => {
    return {
      totalCustomers: customers.length,
      newCustomers: customers.filter((c) => c.status === 'active').length,
      customersWithOrders: customers.filter((c) => c.totalPurchasedAmount > 0).length,
      customersWithReceivables: customers.filter((c) => c.totalReceivableAmount > 0).length,
    };
  }, [customers]);

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/clientes"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Clientes"
          description="Gerencie seus clientes e acompanhe o histórico de relacionamento e compras."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Novo Cliente',
            onClick: () => setIsNewCustomerOpen(true),
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards dinâmicos */}
          <CustomersSummaryCards metrics={dynamicCustomerMetrics} />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, telefone, e-mail ou documento..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-start md:justify-end text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Situação:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customers Table with Row Clicks */}
          <CustomersTable
            customers={filteredCustomers}
            onSelectCustomer={(c) => setSelectedCustomer(c)}
          />
        </main>
      </div>

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onStartOrder={(c) => {
          setSelectedCustomer(null);
          // Redireciona para /pedidos ou abre fluxo
          window.location.href = '/pedidos';
        }}
      />

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onCreated={handleCreatedCustomer}
      />
    </div>
  );
}
