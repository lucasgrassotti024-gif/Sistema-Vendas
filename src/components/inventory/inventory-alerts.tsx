'use client';

import React from 'react';
import { AlertTriangle, AlertOctagon, ArrowRight } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';

interface InventoryAlertsProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}

export function InventoryAlerts({ items, onSelectItem }: InventoryAlertsProps) {
  const criticalItems = items.filter(
    (i) => i.status === 'out_of_stock' || i.status === 'low_stock'
  );

  if (criticalItems.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-300/60 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              Central de Alertas de Reposição ({criticalItems.length})
            </h4>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
              Itens que atingiram o limite mínimo ou estão com saldo zerado no estoque físico.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {criticalItems.slice(0, 6).map((item) => {
          const isOut = item.status === 'out_of_stock';
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                isOut
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200'
                  : 'bg-white/80 dark:bg-[#1e1b18] border-amber-200 dark:border-amber-900/40 text-[#2a221b] dark:text-[#f5f0eb]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isOut ? (
                  <AlertOctagon className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{item.name}</p>
                  <p className="text-[10px] opacity-75 font-mono">
                    {item.sku} • Saldo: {item.currentStock} {item.unit} (Mín: {item.minStock})
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 shrink-0 ml-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
