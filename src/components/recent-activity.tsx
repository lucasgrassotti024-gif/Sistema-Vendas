'use client';

import React from 'react';
import { ActivityItem } from '@/types/dashboard';
import { ShoppingCart, CreditCard, Flame, ShoppingBag, Layers } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const TYPE_ICONS = {
  sale: ShoppingCart,
  payment: CreditCard,
  production: Flame,
  order: ShoppingBag,
  stock: Layers,
};

const TYPE_BADGES = {
  sale: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]',
  payment: 'bg-[#faf5e8] text-[#c29b38] dark:bg-[#2c2415] dark:text-[#d4ac4a]',
  production: 'bg-[#f6eee7] text-[#4a2e18] dark:bg-[#2a2018] dark:text-[#9e6d47]',
  order: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#446d9b]',
  stock: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="p-6 rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
            Atividades Recentes
          </h3>
          <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
            Últimas movimentações operacionais registradas
          </p>
        </div>
        <span className="text-xs font-semibold text-[#235347] dark:text-[#377d6c] hover:underline cursor-pointer">
          Ver histórico completo
        </span>
      </div>

      <div className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
        {activities.map((act) => {
          const Icon = TYPE_ICONS[act.type];
          const badgeStyle = TYPE_BADGES[act.type];

          return (
            <div key={act.id} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-xl shrink-0 ${badgeStyle}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate text-[#2a221b] dark:text-[#f5f0eb]">
                      {act.title}
                    </p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${badgeStyle}`}>
                      {act.badgeText}
                    </span>
                  </div>
                  <p className="text-[11px] truncate text-[#8c7f74] dark:text-[#8a7f75]">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.value && (
                  <p className="text-xs font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {act.value}
                  </p>
                )}
                <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75]">
                  {act.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
