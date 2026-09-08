'use client';

import React from 'react';
import { ProductPerformanceReport } from '@/services/reports-service';
import { TrendingUp, BarChart3, Package } from 'lucide-react';

interface ReportChartsProps {
  products: ProductPerformanceReport[];
}

export function ReportCharts({ products }: ReportChartsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Top 4 produtos mais vendidos
  const topProducts = products.slice(0, 4);
  const maxRevenue = Math.max(...topProducts.map((p) => p.grossRevenue), 100);

  // Evolução mockada de Faturamento vs Despesas nos últimos 5 dias
  const timelineData = [
    { day: '04 Set', sales: 750, expenses: 420 },
    { day: '05 Set', sales: 1200, expenses: 385 },
    { day: '06 Set', sales: 980, expenses: 730 },
    { day: '07 Set', sales: 1450, expenses: 250 },
    { day: '08 Set (Hoje)', sales: 1850, expenses: 2800 },
  ];
  const maxDayVal = 3000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gráfico 1: Evolução Faturamento vs Despesas */}
      <div className="p-5 rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Evolução: Vendas × Despesas
              </h3>
              <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                Confronto de faturamento diário com desembolsos operacionais
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-medium text-[#235347] dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#235347] dark:bg-emerald-400" />
              <span>Vendas</span>
            </span>
            <span className="flex items-center gap-1 font-medium text-rose-700 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Despesas</span>
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
          <div className="grid grid-cols-5 gap-2 items-end h-40 pt-4">
            {timelineData.map((d, i) => {
              const salesH = Math.max(10, Math.round((d.sales / maxDayVal) * 110));
              const expH = Math.max(10, Math.round((d.expenses / maxDayVal) * 110));

              return (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-32 px-1 bg-stone-50/50 dark:bg-stone-900/30 rounded-lg">
                    <div
                      style={{ height: `${salesH}px` }}
                      className="w-3.5 bg-[#235347] dark:bg-[#377d6c] rounded-t-sm"
                      title={`Vendas: ${formatCurrency(d.sales)}`}
                    />
                    <div
                      style={{ height: `${expH}px` }}
                      className="w-3.5 bg-rose-600 dark:bg-rose-500 rounded-t-sm"
                      title={`Despesas: ${formatCurrency(d.expenses)}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#8c7f74] whitespace-nowrap">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gráfico 2: Produtos Mais Vendidos e Faturamento */}
      <div className="p-5 rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#6ba1d6]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Produtos Mais Vendidos
              </h3>
              <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                Ranking por faturamento bruto e saída em unidades
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
            Top 4 Itens
          </span>
        </div>

        <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 space-y-3">
          {topProducts.map((p, idx) => {
            const barWidth = Math.min(100, Math.round((p.grossRevenue / maxRevenue) * 100));

            return (
              <div key={p.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[200px]">
                    #{idx + 1} {p.name}
                  </span>
                  <div className="text-right whitespace-nowrap">
                    <strong className="text-[#235347] dark:text-emerald-400">
                      {formatCurrency(p.grossRevenue)}
                    </strong>
                    <span className="text-[10px] text-[#8c7f74] ml-1">
                      ({p.unitsSold} un)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="bg-[#2c4a6f] dark:bg-[#446d9b] h-2 rounded-full transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
