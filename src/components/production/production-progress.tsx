'use client';

import React from 'react';
import { ProductionOrder } from '@/types/production';
import { Check, Clock, PlayCircle } from 'lucide-react';

interface ProductionProgressProps {
  order: ProductionOrder;
}

export function ProductionProgress({ order }: ProductionProgressProps) {
  const percent =
    order.plannedQuantity > 0
      ? Math.min(100, Math.round((order.producedQuantity / order.plannedQuantity) * 100))
      : 0;

  const remaining = Math.max(0, order.plannedQuantity - order.producedQuantity);

  const getStepState = (stepIndex: number) => {
    // 0: Planejada, 1: Em produção, 2: Concluída
    if (order.status === 'cancelled') return 'cancelled';
    if (order.status === 'completed') return 'done';
    if (order.status === 'in_production') {
      if (stepIndex <= 1) return 'active';
      return 'pending';
    }
    // scheduled
    if (stepIndex === 0) return 'active';
    return 'pending';
  };

  const steps = [
    { label: 'Planejada', icon: Clock },
    { label: 'Em Produção', icon: PlayCircle },
    { label: 'Concluída', icon: Check },
  ];

  return (
    <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
          Acompanhamento do Fluxo
        </span>
        <span className="text-xs font-extrabold text-[#235347] dark:text-emerald-400">
          {percent}% Concluído
        </span>
      </div>

      {/* Stepper Visual */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-stone-800 -z-0" />
        {steps.map((s, idx) => {
          const state = getStepState(idx);
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  state === 'done' || state === 'active'
                    ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                    : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600 border border-stone-300 dark:border-stone-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  state === 'done' || state === 'active'
                    ? 'text-[#2a221b] dark:text-[#f5f0eb]'
                    : 'text-[#8c7f74]'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#235347] dark:bg-[#377d6c] h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 text-center">
        <div>
          <span className="text-[10px] text-[#8c7f74] block uppercase">Planejada</span>
          <strong className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
            {order.plannedQuantity} un
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-[#8c7f74] block uppercase">Produzida</span>
          <strong className="text-xs text-[#235347] dark:text-emerald-400">
            {order.producedQuantity} un
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-[#8c7f74] block uppercase">Restante</span>
          <strong className="text-xs text-[#4a2e18] dark:text-[#d4a373]">
            {remaining} un
          </strong>
        </div>
      </div>
    </div>
  );
}
