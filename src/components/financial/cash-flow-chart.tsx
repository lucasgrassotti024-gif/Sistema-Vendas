'use client';

import React from 'react';
import { CashFlowDataPoint } from '@/types/financial';
import { TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface CashFlowChartProps {
  data: CashFlowDataPoint[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Escala máxima para altura das barras
  const maxVal = Math.max(...data.map((d) => Math.max(d.inflows, d.outflows, Math.abs(d.netResult))), 3000);

  return (
    <div className="p-5 rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Fluxo de Caixa Operacional
            </h3>
            <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
              Evolução comparativa de entradas, saídas e resultado líquido no período
            </p>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#235347] dark:bg-[#377d6c]" />
            <span className="text-[#63574d] dark:text-[#c4b9ae] font-medium">Entradas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-600 dark:bg-rose-500" />
            <span className="text-[#63574d] dark:text-[#c4b9ae] font-medium">Saídas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#c29b38] dark:bg-[#d4ac4a]" />
            <span className="text-[#63574d] dark:text-[#c4b9ae] font-medium">Resultado Líquido</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras com escala proporcional */}
      <div className="pt-4 pb-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-end min-h-[160px]">
          {data.map((item, idx) => {
            const inflowHeight = Math.max(12, Math.round((item.inflows / maxVal) * 120));
            const outflowHeight = Math.max(12, Math.round((item.outflows / maxVal) * 120));
            const isResultPositive = item.netResult >= 0;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 group">
                {/* Barras Lado a Lado */}
                <div className="w-full flex items-end justify-center gap-2 h-32 px-2 bg-stone-50/50 dark:bg-stone-900/30 rounded-xl pt-2">
                  {/* Entrada */}
                  <div className="flex-1 flex flex-col items-center max-w-[28px]">
                    <div
                      style={{ height: `${inflowHeight}px` }}
                      className="w-full bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] rounded-t-md transition-all shadow-xs"
                      title={`Entradas: ${formatCurrency(item.inflows)}`}
                    />
                  </div>

                  {/* Saída */}
                  <div className="flex-1 flex flex-col items-center max-w-[28px]">
                    <div
                      style={{ height: `${outflowHeight}px` }}
                      className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 rounded-t-md transition-all shadow-xs"
                      title={`Saídas: ${formatCurrency(item.outflows)}`}
                    />
                  </div>
                </div>

                {/* Legenda do Período e Resultado */}
                <div className="text-center">
                  <p className="text-[11px] font-bold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {item.periodLabel}
                  </p>
                  <span
                    className={`text-[10px] font-extrabold block mt-0.5 ${
                      isResultPositive
                        ? 'text-[#235347] dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isResultPositive ? `+${formatCurrency(item.netResult)}` : formatCurrency(item.netResult)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
