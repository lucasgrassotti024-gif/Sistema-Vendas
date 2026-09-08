'use client';

import React from 'react';
import { SalesDayTrend, FinancialOverview } from '@/types/dashboard';
import { TrendingUp, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';

interface SalesTrendChartProps {
  data: SalesDayTrend[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const maxSale = Math.max(...data.map((d) => d.sales));

  return (
    <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
            Evolução das Vendas
          </h3>
          <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
            Volume diário de faturamento na semana
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-[#e9f1ee] dark:bg-[#192723] px-2.5 py-1 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14,2%</span>
        </div>
      </div>

      {/* Bar/Trend Visualization */}
      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-[#e5dfd3]/60 dark:border-[#38322c]/60">
        {data.map((item) => {
          const heightPercent = Math.round((item.sales / maxSale) * 100);
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-semibold text-[#8c7f74] opacity-0 group-hover:opacity-100 transition-opacity">
                R${item.sales}
              </div>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full max-w-[36px] rounded-t-lg bg-[#235347]/85 hover:bg-[#235347] dark:bg-[#377d6c]/85 dark:hover:bg-[#377d6c] transition-all cursor-pointer relative"
              />
              <span className="text-xs font-medium text-[#63574d] dark:text-[#c4b9ae]">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#8c7f74] dark:text-[#8a7f75]">
        <span>Pico: Sexta-feira (R$ 3.200,00)</span>
        <span>Média diária: R$ 2.121,00</span>
      </div>
    </div>
  );
}

interface FinancialOverviewProps {
  data: FinancialOverview;
}

export function FinancialOverviewCard({ data }: FinancialOverviewProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const total = data.revenue + data.expenses;
  const revPercent = Math.round((data.revenue / total) * 100);
  const expPercent = 100 - revPercent;

  return (
    <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
              Situação Financeira
            </h3>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
              Balanço consolidado de receitas vs. despesas
            </p>
          </div>
          <div className="p-2 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38]">
            <PieChart className="w-4 h-4" />
          </div>
        </div>

        {/* Big Profit Number */}
        <div className="p-4 rounded-xl bg-[#f8f6f0] dark:bg-[#23201c] border border-[#e5dfd3] dark:border-[#38322c] mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
            Resultado Líquido do Período
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#235347] dark:text-emerald-400">
              {formatCurrency(data.netProfit)}
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              ({data.marginPercent}% de margem)
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#235347] dark:text-emerald-400">Receitas ({revPercent}%)</span>
            <span className="text-rose-700 dark:text-rose-400">Despesas ({expPercent}%)</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex bg-stone-200 dark:bg-stone-800">
            <div
              style={{ width: `${revPercent}%` }}
              className="bg-[#235347] dark:bg-[#377d6c]"
            />
            <div
              style={{ width: `${expPercent}%` }}
              className="bg-rose-500/80 dark:bg-rose-600/80"
            />
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
        <div className="p-3 rounded-xl bg-[#e9f1ee]/50 dark:bg-[#192723]/50">
          <div className="flex items-center gap-1.5 text-xs text-[#235347] dark:text-emerald-400 font-semibold mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Receitas</span>
          </div>
          <p className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
            {formatCurrency(data.revenue)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-semibold mb-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Despesas</span>
          </div>
          <p className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
            {formatCurrency(data.expenses)}
          </p>
        </div>
      </div>
    </div>
  );
}
