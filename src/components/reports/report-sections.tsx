'use client';

import React from 'react';
import {
  ProductPerformanceReport,
  ClientSalesReport,
  SupplierPurchaseReport,
} from '@/services/reports-service';
import { ShoppingBag, Package, Layers, Flame, Truck, DollarSign, Users, CheckCircle2 } from 'lucide-react';

interface ReportSectionsProps {
  activeTab: 'vendas' | 'pedidos' | 'produtos' | 'estoque' | 'producao' | 'compras' | 'financeiro';
  products: ProductPerformanceReport[];
  clients: ClientSalesReport[];
  suppliers: SupplierPurchaseReport[];
  ordersMetrics: {
    totalOrders: number;
    delivered: number;
    pending: number;
    inProduction: number;
    cancelled: number;
  };
  productionMetrics: {
    totalOrders: number;
    completedOrdersCount: number;
    totalProducedUnits: number;
    totalLostUnits: number;
    averageYieldPercent: string;
  };
  inventoryMetrics: {
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalStockValue: number;
  };
}

export function ReportSections({
  activeTab,
  products,
  clients,
  suppliers,
  ordersMetrics,
  productionMetrics,
  inventoryMetrics,
}: ReportSectionsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-4">
      {/* ABA 1: VENDAS */}
      {activeTab === 'vendas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
              <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Faturamento Bruto</span>
              <strong className="text-xl font-extrabold text-[#235347] dark:text-emerald-400 block mt-1">
                {formatCurrency(products.reduce((acc, curr) => acc + curr.grossRevenue, 0))}
              </strong>
            </div>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
              <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Unidades Vendidas</span>
              <strong className="text-xl font-extrabold text-[#2a221b] dark:text-[#f5f0eb] block mt-1">
                {products.reduce((acc, curr) => acc + curr.unitsSold, 0)} un
              </strong>
            </div>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
              <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Ticket Médio Estimado</span>
              <strong className="text-xl font-extrabold text-[#2c4a6f] dark:text-[#6ba1d6] block mt-1">
                R$ 80,70
              </strong>
            </div>
          </div>

          {/* Vendas por Cliente */}
          <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#235347]" />
              <h4 className="text-xs font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Vendas Consolidadas por Cliente
              </h4>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[10px] font-bold uppercase text-[#8c7f74]">
                  <th className="py-2.5 px-4">Cliente</th>
                  <th className="py-2.5 px-4 text-center">Pedidos / Vendas</th>
                  <th className="py-2.5 px-4 text-right">Total Comprado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
                {clients.map((c, i) => (
                  <tr key={i} className="hover:bg-[#f1ede4]/40 dark:hover:bg-[#2c2824]/40">
                    <td className="py-2.5 px-4 font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                      {c.customerName}
                    </td>
                    <td className="py-2.5 px-4 text-center text-[#63574d] dark:text-[#c4b9ae]">
                      {c.ordersCount}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-[#235347] dark:text-emerald-400">
                      {formatCurrency(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Total de Pedidos</span>
            <strong className="text-xl font-extrabold text-[#2a221b] dark:text-[#f5f0eb] block mt-1">
              {ordersMetrics.totalOrders}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Entregues</span>
            <strong className="text-xl font-extrabold text-[#235347] dark:text-emerald-400 block mt-1">
              {ordersMetrics.delivered}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#2c4a6f] dark:text-[#6ba1d6] uppercase font-bold">Em Produção</span>
            <strong className="text-xl font-extrabold text-[#2c4a6f] dark:text-[#6ba1d6] block mt-1">
              {ordersMetrics.inProduction}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#c29b38] dark:text-[#d4ac4a] uppercase font-bold">Pendentes</span>
            <strong className="text-xl font-extrabold text-[#c29b38] dark:text-[#d4ac4a] block mt-1">
              {ordersMetrics.pending}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-stone-500 uppercase font-bold">Cancelados</span>
            <strong className="text-xl font-extrabold text-stone-500 block mt-1">
              {ordersMetrics.cancelled}
            </strong>
          </div>
        </div>
      )}

      {/* ABA 3: PRODUTOS */}
      {activeTab === 'produtos' && (
        <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[10px] font-bold uppercase text-[#8c7f74]">
                <th className="py-2.5 px-4">Produto</th>
                <th className="py-2.5 px-4">Categoria</th>
                <th className="py-2.5 px-4 text-center">Unid. Vendidas</th>
                <th className="py-2.5 px-4 text-right">Preço Venda</th>
                <th className="py-2.5 px-4 text-right">Custo</th>
                <th className="py-2.5 px-4 text-right">Margem %</th>
                <th className="py-2.5 px-4 text-right">Faturamento</th>
                <th className="py-2.5 px-4 text-center">Estoque Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#f1ede4]/40 dark:hover:bg-[#2c2824]/40">
                  <td className="py-2.5 px-4 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {p.name}
                  </td>
                  <td className="py-2.5 px-4 text-[#63574d] dark:text-[#c4b9ae]">{p.category}</td>
                  <td className="py-2.5 px-4 text-center font-bold">{p.unitsSold} un</td>
                  <td className="py-2.5 px-4 text-right">{formatCurrency(p.salePrice)}</td>
                  <td className="py-2.5 px-4 text-right">{formatCurrency(p.unitCost)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
                    {p.marginPercent}%
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-[#235347] dark:text-emerald-400">
                    {formatCurrency(p.grossRevenue)}
                  </td>
                  <td className="py-2.5 px-4 text-center">{p.currentStock} un</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 4: ESTOQUE */}
      {activeTab === 'estoque' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Itens Cadastrados</span>
            <strong className="text-xl font-extrabold text-[#2a221b] dark:text-[#f5f0eb] block mt-1">
              {inventoryMetrics.totalItems}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#c29b38] dark:text-[#d4ac4a] uppercase font-bold">Estoque Baixo</span>
            <strong className="text-xl font-extrabold text-[#c29b38] dark:text-[#d4ac4a] block mt-1">
              {inventoryMetrics.lowStockCount}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-bold">Zerados</span>
            <strong className="text-xl font-extrabold text-rose-700 dark:text-rose-400 block mt-1">
              {inventoryMetrics.outOfStockCount}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#235347] dark:text-[#377d6c] uppercase font-bold">Custo Total Imobilizado</span>
            <strong className="text-xl font-extrabold text-[#235347] dark:text-emerald-400 block mt-1">
              {formatCurrency(inventoryMetrics.totalStockValue)}
            </strong>
          </div>
        </div>
      )}

      {/* ABA 5: PRODUÇÃO */}
      {activeTab === 'producao' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Ordens de Produção</span>
            <strong className="text-xl font-extrabold text-[#2a221b] dark:text-[#f5f0eb] block mt-1">
              {productionMetrics.totalOrders}
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#235347] dark:text-emerald-400 uppercase font-bold">Unidades Produzidas</span>
            <strong className="text-xl font-extrabold text-[#235347] dark:text-emerald-400 block mt-1">
              {productionMetrics.totalProducedUnits} un
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-bold">Perdas no Forno/Corte</span>
            <strong className="text-xl font-extrabold text-rose-700 dark:text-rose-400 block mt-1">
              {productionMetrics.totalLostUnits} un
            </strong>
          </div>
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-center">
            <span className="text-[10px] text-[#c29b38] dark:text-[#d4ac4a] uppercase font-bold">Rendimento Médio</span>
            <strong className="text-xl font-extrabold text-[#c29b38] dark:text-[#d4ac4a] block mt-1">
              {productionMetrics.averageYieldPercent}%
            </strong>
          </div>
        </div>
      )}

      {/* ABA 6: COMPRAS */}
      {activeTab === 'compras' && (
        <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2c4a6f]" />
            <h4 className="text-xs font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Compras Consolidadas por Fornecedor
            </h4>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[10px] font-bold uppercase text-[#8c7f74]">
                <th className="py-2.5 px-4">Fornecedor</th>
                <th className="py-2.5 px-4 text-center">Nº de Compras</th>
                <th className="py-2.5 px-4 text-right">Total Adquirido</th>
                <th className="py-2.5 px-4 text-right">Saldo em Aberto (A Pagar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
              {suppliers.map((s, i) => (
                <tr key={i} className="hover:bg-[#f1ede4]/40 dark:hover:bg-[#2c2824]/40">
                  <td className="py-2.5 px-4 font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                    {s.supplierName}
                  </td>
                  <td className="py-2.5 px-4 text-center text-[#63574d] dark:text-[#c4b9ae]">
                    {s.purchasesCount}
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-[#2a221b] dark:text-[#f5f0eb]">
                    {formatCurrency(s.totalSpent)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#c29b38] dark:text-[#d4ac4a]">
                    {formatCurrency(s.pendingAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 7: FINANCEIRO */}
      {activeTab === 'financeiro' && (
        <div className="p-5 rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#235347]" />
            <h4 className="font-bold text-sm text-[#2a221b] dark:text-[#f5f0eb]">
              Resumo Operacional de Fluxo Financeiro
            </h4>
          </div>
          <p className="text-[#63574d] dark:text-[#c4b9ae]">
            O resultado financeiro mede o fluxo real de liquidações (entradas menos saídas), sem confundir com faturamento a prazo ou lucro contábil.
          </p>
        </div>
      )}
    </div>
  );
}
