'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { PurchaseSummaryCards } from '@/components/purchases/purchase-summary-cards';
import { PurchaseTable } from '@/components/purchases/purchase-table';
import { PurchaseDetailsDrawer } from '@/components/purchases/purchase-details-drawer';
import { NewPurchaseModal } from '@/components/purchases/new-purchase-modal';
import { NewSupplierModal } from '@/components/purchases/new-supplier-modal';
import { CancelPurchaseModal } from '@/components/purchases/cancel-purchase-modal';
import { PurchaseOrder, Supplier } from '@/types/purchases';
import { purchaseService } from '@/services/purchase-service';
import { Search } from 'lucide-react';

export default function ComprasPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null);

  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);

  const [purchaseToCancel, setPurchaseToCancel] = useState<PurchaseOrder | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const loadData = useCallback(() => {
    const list = purchaseService.getAll();
    const sups = purchaseService.getSuppliers();
    setPurchases(list);
    setSuppliers(sups);

    if (selectedPurchase) {
      const refreshed = list.find((p) => p.id === selectedPurchase.id) || null;
      setSelectedPurchase(refreshed);
    }
  }, [selectedPurchase]);

  useEffect(() => {
    loadData();
  }, []);

  const summaryMetrics = useMemo(() => {
    return purchaseService.calculateSummary(purchases);
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const matchSearch =
        p.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.items.some((it) => it.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      let matchPeriod = true;
      if (periodFilter === 'september') {
        matchPeriod = p.date.includes('09/2026');
      }

      return matchSearch && matchStatus && matchPeriod;
    });
  }, [purchases, searchTerm, statusFilter, periodFilter]);

  const handleOpenCancel = (purchase: PurchaseOrder) => {
    setPurchaseToCancel(purchase);
    setIsCancelModalOpen(true);
  };

  const handleNewPurchaseSuccess = (newPurchase: PurchaseOrder) => {
    loadData();
    setSelectedPurchase(newPurchase);
  };

  const handleCancelSuccess = (cancelledPurchase: PurchaseOrder) => {
    loadData();
    if (selectedPurchase && selectedPurchase.id === cancelledPurchase.id) {
      setSelectedPurchase(cancelledPurchase);
    }
  };

  const handleNewSupplierSuccess = (newSupplier: Supplier) => {
    loadData();
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/compras"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Compras"
          description="Registre compras, acompanhe fornecedores e controle os valores adquiridos."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Nova Compra',
            onClick: () => setIsNewPurchaseOpen(true),
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards */}
          <PurchaseSummaryCards metrics={summaryMetrics} />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nº, fornecedor ou item..."
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
                  <option value="paid">Pago</option>
                  <option value="partial">Parcial</option>
                  <option value="pending">Pendente</option>
                  <option value="cancelled">Cancelado</option>
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
                  <option value="september">Setembro 2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Compras */}
          <PurchaseTable
            purchases={filteredPurchases}
            onSelectPurchase={(pur) => setSelectedPurchase(pur)}
            onOpenCancel={(pur) => handleOpenCancel(pur)}
          />
        </main>
      </div>

      {/* Drawer de Detalhes da Compra */}
      <PurchaseDetailsDrawer
        purchase={selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        onOpenCancel={(pur) => {
          setSelectedPurchase(null);
          handleOpenCancel(pur);
        }}
      />

      {/* Modal Nova Compra */}
      <NewPurchaseModal
        isOpen={isNewPurchaseOpen}
        onClose={() => setIsNewPurchaseOpen(false)}
        onSuccess={handleNewPurchaseSuccess}
        onOpenNewSupplier={() => setIsNewSupplierOpen(true)}
        suppliers={suppliers}
      />

      {/* Modal Novo Fornecedor */}
      <NewSupplierModal
        isOpen={isNewSupplierOpen}
        onClose={() => setIsNewSupplierOpen(false)}
        onSuccess={handleNewSupplierSuccess}
      />

      {/* Modal Cancelar Compra */}
      <CancelPurchaseModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setPurchaseToCancel(null);
        }}
        onSuccess={handleCancelSuccess}
        purchase={purchaseToCancel}
      />
    </div>
  );
}
