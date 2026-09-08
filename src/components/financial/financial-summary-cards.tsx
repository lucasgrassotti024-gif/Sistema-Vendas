'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, Wallet } from 'lucide-react';
import { FinancialSummaryMetrics } from '@/types/financial';

interface FinancialSummaryCardsProps {
  metrics: FinancialSummaryMetrics;
}

export function FinancialSummaryCards({ metrics }: FinancialSummaryCardsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const isPositiveResult = metrics.periodResult >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Entradas */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Entradas
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#235347] dark:text-emerald-400">
              {formatCurrency(metrics.totalInflows)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Recebimentos confirmados
        </p>
      </div>

      {/* Saídas */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#991b1b] dark:border-l-[#ef4444] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Saídas
            </p>
            <h3 className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-400">
              {formatCurrency(metrics.totalOutflows)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Pagamentos e custos liquidados
        </p>
      </div>

      {/* A Receber */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              A Receber
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              {formatCurrency(metrics.totalReceivables)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Títulos de clientes em aberto
        </p>
      </div>

      {/* A Pagar */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              A Pagar
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {formatCurrency(metrics.totalPayables)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Fornecedores e contas a liquidar
        </p>
      </div>

      {/* Resultado do Período */}
      <div
        className={`p-5 rounded-2xl border border-l-4 bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs ${
          isPositiveResult
            ? 'border-l-[#235347] dark:border-l-[#377d6c]'
            : 'border-l-rose-600 dark:border-l-rose-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Resultado do Período
            </p>
            <h3
              className={`mt-1 text-2xl font-bold ${
                isPositiveResult
                  ? 'text-[#235347] dark:text-emerald-400'
                  : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              {formatCurrency(metrics.periodResult)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
          Entradas liquidadas − Saídas
        </p>
      </div>
    </div>
  );
}
