'use client';

import React from 'react';
import { ProductionOrder } from '@/types/production';
import { Award, AlertOctagon, CheckCircle2, TrendingUp } from 'lucide-react';

interface ProductionResultProps {
  order: ProductionOrder;
}

export function ProductionResult({ order }: ProductionResultProps) {
  if (order.status !== 'completed') return null;

  const goodQty = order.producedQuantity;
  const lostQty = order.lostQuantity || 0;
  const totalProcessed = goodQty + lostQty;
  const yieldPercent =
    totalProcessed > 0 ? ((goodQty / totalProcessed) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
        <Award className="w-4 h-4 text-[#c29b38]" />
        <span>Resultado e Rendimento da Fornada</span>
      </h4>

      <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-3 shadow-xs">
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Unidades Boas */}
          <div className="p-2.5 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] border border-emerald-200/50 dark:border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-[#235347] dark:text-[#377d6c] block">
              Unidades Boas
            </span>
            <span className="text-base font-extrabold text-[#235347] dark:text-emerald-400 mt-0.5 block">
              {goodQty} un
            </span>
          </div>

          {/* Unidades Perdidas */}
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40">
            <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block">
              Perdas
            </span>
            <span className="text-base font-extrabold text-rose-700 dark:text-rose-400 mt-0.5 block">
              {lostQty} un
            </span>
          </div>

          {/* Rendimento */}
          <div className="p-2.5 rounded-lg bg-[#faf5e8] dark:bg-[#2c2415] border border-amber-300/40 text-center">
            <span className="text-[10px] uppercase font-bold text-[#c29b38] dark:text-[#d4ac4a] block">
              Rendimento
            </span>
            <span className="text-base font-extrabold text-[#c29b38] dark:text-[#d4ac4a] mt-0.5 block">
              {yieldPercent}%
            </span>
          </div>
        </div>

        {order.lossReason && (
          <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 flex items-start gap-2 text-[11px] text-rose-800 dark:text-rose-300">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="block font-semibold">Motivo do Descarte:</strong>
              <span>{order.lossReason}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
