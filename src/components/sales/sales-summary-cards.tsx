'use client';

import React from 'react';
import { ShoppingCart, Calendar, DollarSign, Clock } from 'lucide-react';
import { SalesSummaryMetrics } from '@/types/sales';

interface SalesSummaryCardsProps {
  metrics: SalesSummaryMetrics;
}

export function SalesSummaryCards({ metrics }: SalesSummaryCardsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Vendas Hoje */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Vendas Hoje
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.salesTodayCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Registradas na data de hoje
        </p>
      </div>

      {/* Vendas no Período */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Vendas no Período
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.salesPeriodCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Acumulado selecionado
        </p>
      </div>

      {/* Valor Vendido */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#4a2e18] dark:border-l-[#9e6d47] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Valor Vendido
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#235347] dark:text-emerald-400">
              {formatCurrency(metrics.totalSoldAmount)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f6eee7] dark:bg-[#2a2018] text-[#4a2e18] dark:text-[#9e6d47]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Faturamento bruto acumulado
        </p>
      </div>

      {/* Valor a Receber */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Valor a Receber
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {formatCurrency(metrics.totalReceivableAmount)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Saldos em aberto de clientes
        </p>
      </div>
    </div>
  );
}
