'use client';

import React from 'react';
import { ShoppingBag, DollarSign, Clock, Users } from 'lucide-react';
import { PurchasesSummaryMetrics } from '@/types/purchases';

interface PurchaseSummaryCardsProps {
  metrics: PurchasesSummaryMetrics;
}

export function PurchaseSummaryCards({ metrics }: PurchaseSummaryCardsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Compras no Período */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Compras no Período
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.periodPurchasesCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Pedidos e notas de compras ativas
        </p>
      </div>

      {/* Valor Comprado */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Valor Comprado
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              {formatCurrency(metrics.totalPurchasedValue)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Montante total adquirido em insumos
        </p>
      </div>

      {/* Compras a Pagar */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Compras a Pagar
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {formatCurrency(metrics.totalPendingPayment)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Saldo em aberto com fornecedores
        </p>
      </div>

      {/* Fornecedores Ativos */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#4a2e18] dark:border-l-[#8a5b32] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Fornecedores Ativos
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#4a2e18] dark:text-[#d4a373]">
              {metrics.activeSuppliersCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f8f1ea] dark:bg-[#281e16] text-[#4a2e18] dark:text-[#d4a373]">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Parceiros cadastrados para compras
        </p>
      </div>
    </div>
  );
}
