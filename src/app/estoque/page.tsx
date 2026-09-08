'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { InventorySummaryCards } from '@/components/inventory/inventory-summary-cards';
import { InventoryAlerts } from '@/components/inventory/inventory-alerts';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { InventoryItemDrawer } from '@/components/inventory/inventory-item-drawer';
import { NewMovementModal } from '@/components/inventory/new-movement-modal';
import { InventoryItem, InventoryItemType, InventoryStatus } from '@/types/inventory';
import { inventoryService } from '@/services/inventory-service';
import { Search } from 'lucide-react';

export default function EstoquePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementPreselectedItem, setMovementPreselectedItem] = useState<InventoryItem | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Carrega itens de estoque
  const loadInventory = useCallback(() => {
    const list = inventoryService.getAll();
    setItems(list);

    if (selectedItem) {
      const refreshed = list.find((i) => i.id === selectedItem.id) || null;
      setSelectedItem(refreshed);
    }
  }, [selectedItem]);

  useEffect(() => {
    loadInventory();
  }, []);

  // Métricas de resumo calculadas
  const summaryMetrics = useMemo(() => {
    return inventoryService.calculateSummary(items);
  }, [items]);

  // Filtragem combinada
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = typeFilter === 'all' || item.type === typeFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);

  const handleOpenGeneralMovement = () => {
    setMovementPreselectedItem(null);
    setIsMovementModalOpen(true);
  };

  const handleOpenItemMovement = (item: InventoryItem) => {
    setMovementPreselectedItem(item);
    setIsMovementModalOpen(true);
  };

  const handleMovementSuccess = (updatedItem: InventoryItem) => {
    loadInventory();
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/estoque"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Estoque"
          description="Acompanhe saldos, movimentações e necessidades de reposição."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Nova Movimentação',
            onClick: handleOpenGeneralMovement,
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards */}
          <InventorySummaryCards metrics={summaryMetrics} />

          {/* Central de Alertas Visuais de Reposição */}
          <InventoryAlerts
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
          />

          {/* Filter Toolbar */}
          <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, SKU ou categoria..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-start md:justify-end text-xs">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                  Tipo:
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="product">Produtos</option>
                  <option value="material">Materiais (Insumos)</option>
                  <option value="packaging">Embalagens</option>
                </select>
              </div>

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
                  <option value="all">Todas as Situações</option>
                  <option value="normal">Normal</option>
                  <option value="low_stock">Estoque Baixo</option>
                  <option value="out_of_stock">Sem Estoque</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Estoque */}
          <InventoryTable
            items={filteredItems}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        </main>
      </div>

      {/* Drawer de Detalhes e Histórico Imutável */}
      <InventoryItemDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenMovement={(item) => {
          handleOpenItemMovement(item);
        }}
      />

      {/* Modal de Nova Movimentação */}
      <NewMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSuccess={handleMovementSuccess}
        preselectedItem={movementPreselectedItem}
        itemsList={items}
      />
    </div>
  );
}
