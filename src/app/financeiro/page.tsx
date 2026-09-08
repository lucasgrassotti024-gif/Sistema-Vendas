'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { FinancialSummaryCards } from '@/components/financial/financial-summary-cards';
import { CashFlowChart } from '@/components/financial/cash-flow-chart';
import { TransactionsTable } from '@/components/financial/transactions-table';
import { ReceivablesSection } from '@/components/financial/receivables-section';
import { PayablesSection } from '@/components/financial/payables-section';
import { AdvancesSection } from '@/components/financial/advances-section';
import { FinancialDetailsDrawer } from '@/components/financial/financial-details-drawer';
import { PaymentModal } from '@/components/financial/payment-modal';
import { NewTransactionModal } from '@/components/financial/new-transaction-modal';
import {
  FinancialTransaction,
  TitleReceivable,
  TitlePayable,
  CustomerAdvance,
  CashFlowDataPoint,
} from '@/types/financial';
import { financialService } from '@/services/financial-service';
import {
  Search,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function FinanceiroPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'receivables' | 'payables' | 'advances'>('transactions');

  // Dados financeiros
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [receivables, setReceivables] = useState<TitleReceivable[]>([]);
  const [payables, setPayables] = useState<TitlePayable[]>([]);
  const [advances, setAdvances] = useState<CustomerAdvance[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlowDataPoint[]>([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modais e Drawer
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<
    | { type: 'transaction'; data: FinancialTransaction }
    | { type: 'receivable'; data: TitleReceivable }
    | { type: 'payable'; data: TitlePayable }
    | null
  >(null);

  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    item: TitleReceivable | TitlePayable | null;
    type: 'receivable' | 'payable';
  }>({
    isOpen: false,
    item: null,
    type: 'receivable',
  });

  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);

  const loadData = useCallback(() => {
    setTransactions(financialService.getTransactions());
    setReceivables(financialService.getReceivables());
    setPayables(financialService.getPayables());
    setAdvances(financialService.getAdvances());
    setCashFlowData(financialService.getCashFlowData());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Resumo de KPIs
  const summaryMetrics = useMemo(() => {
    return financialService.calculateSummary();
  }, [transactions, receivables, payables]);

  // Filtragem de transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.referenceId && tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = typeFilter === 'all' || tx.type === typeFilter;
      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const handleOpenPaymentFromDrawer = (
    item: TitleReceivable | TitlePayable,
    type: 'receivable' | 'payable'
  ) => {
    setSelectedDrawerItem(null);
    setPaymentModalState({
      isOpen: true,
      item,
      type,
    });
  };

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Sidebar Reutilizável com rota ativa destacada */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/financeiro"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header Consistente */}
        <Header
          title="Financeiro"
          description="Acompanhe o fluxo financeiro, recebimentos e pagamentos da empresa."
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          actionButton={{
            label: 'Novo Lançamento',
            onClick: () => setIsNewTxModalOpen(true),
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Summary Cards (Entradas, Saídas, A Receber, A Pagar, Resultado) */}
          <FinancialSummaryCards metrics={summaryMetrics} />

          {/* Gráfico do Fluxo de Caixa Operacional */}
          <CashFlowChart data={cashFlowData} />

          {/* Abas de Navegação Financeira */}
          <div className="flex items-center gap-2 border-b border-[#e5dfd3] dark:border-[#38322c] pb-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                  : 'text-[#63574d] dark:text-[#c4b9ae] hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Movimentações do Caixa ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('receivables')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'receivables'
                  ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                  : 'text-[#63574d] dark:text-[#c4b9ae] hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Contas a Receber ({receivables.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payables')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'payables'
                  ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                  : 'text-[#63574d] dark:text-[#c4b9ae] hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Contas a Pagar ({payables.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('advances')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'advances'
                  ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                  : 'text-[#63574d] dark:text-[#c4b9ae] hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Adiantamentos de Clientes ({advances.length})</span>
            </button>
          </div>

          {/* Conteúdo da Aba Selecionada */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* Filter Toolbar */}
              <div className="p-4 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7f74]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por descrição, categoria ou ref..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-start md:justify-end text-xs">
                  {/* Tipo Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8c7f74] dark:text-[#8a7f75] font-semibold text-[11px] uppercase">
                      Tipo:
                    </span>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
                    >
                      <option value="all">Todos</option>
                      <option value="entrada">Entradas</option>
                      <option value="saida">Saídas</option>
                    </select>
                  </div>

                  {/* Período */}
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
                      <option value="month">Setembro 2026</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tabela de Transações */}
              <TransactionsTable
                transactions={filteredTransactions}
                onSelectTransaction={(tx) =>
                  setSelectedDrawerItem({ type: 'transaction', data: tx })
                }
              />
            </div>
          )}

          {activeTab === 'receivables' && (
            <ReceivablesSection
              receivables={receivables}
              onSelectReceivable={(rec) =>
                setSelectedDrawerItem({ type: 'receivable', data: rec })
              }
              onOpenPaymentModal={(rec) =>
                setPaymentModalState({
                  isOpen: true,
                  item: rec,
                  type: 'receivable',
                })
              }
            />
          )}

          {activeTab === 'payables' && (
            <PayablesSection
              payables={payables}
              onSelectPayable={(pay) =>
                setSelectedDrawerItem({ type: 'payable', data: pay })
              }
              onOpenPaymentModal={(pay) =>
                setPaymentModalState({
                  isOpen: true,
                  item: pay,
                  type: 'payable',
                })
              }
            />
          )}

          {activeTab === 'advances' && (
            <AdvancesSection advances={advances} />
          )}
        </main>
      </div>

      {/* Drawer de Detalhes Financeiros */}
      <FinancialDetailsDrawer
        selectedItem={selectedDrawerItem}
        onClose={() => setSelectedDrawerItem(null)}
        onOpenPayment={(item, type) => handleOpenPaymentFromDrawer(item, type)}
      />

      {/* Modal de Registro de Pagamento / Liquidação de Título */}
      <PaymentModal
        isOpen={paymentModalState.isOpen}
        onClose={() =>
          setPaymentModalState({ isOpen: false, item: null, type: 'receivable' })
        }
        onSuccess={() => {
          loadData();
        }}
        titleItem={paymentModalState.item}
        titleType={paymentModalState.type}
      />

      {/* Modal Novo Lançamento Direto */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
