'use client';

import React from 'react';
import { Layers, AlertTriangle, AlertOctagon, DollarSign } from 'lucide-react';
import { InventorySummaryMetrics } from '@/types/inventory';

interface InventorySummaryCardsProps {
  metrics: InventorySummaryMetrics;
}

export function InventorySummaryCards({ metrics }: InventorySummaryCardsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Itens em Estoque */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Itens em Estoque
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.totalItems}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Produtos, matérias-primas e embalagens
        </p>
      </div>

      {/* Estoque Baixo */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Estoque Baixo
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {metrics.lowStockItems}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          No limite ou abaixo do estoque de segurança
        </p>
      </div>

      {/* Sem Estoque */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#991b1b] dark:border-l-[#ef4444] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Sem Estoque
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#991b1b] dark:text-[#ef4444]">
              {metrics.outOfStockItems}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Saldo zerado com reposição urgente
        </p>
      </div>

      {/* Valor em Estoque */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Valor em Estoque
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              {formatCurrency(metrics.totalStockValue)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Custo total imobilizado em estoque físico
        </p>
      </div>
    </div>
  );
}
