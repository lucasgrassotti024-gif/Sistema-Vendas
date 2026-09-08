'use client';

import React from 'react';
import { InventoryItem, InventoryItemType, InventoryStatus } from '@/types/inventory';
import { Eye, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}

const TYPE_CONFIG: Record<InventoryItemType, { label: string; style: string }> = {
  product: {
    label: 'Produto',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  material: {
    label: 'Material',
    style: 'bg-[#faf5e8] text-[#916b15] dark:bg-[#2c2415] dark:text-[#d4ac4a] border border-amber-300/40 dark:border-amber-700/40',
  },
  packaging: {
    label: 'Embalagem',
    style: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#6ba1d6] border border-blue-300/40 dark:border-blue-700/40',
  },
};

const STATUS_CONFIG: Record<InventoryStatus, { label: string; style: string; icon: React.ElementType }> = {
  normal: {
    label: 'Normal',
    style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40',
    icon: CheckCircle2,
  },
  low_stock: {
    label: 'Estoque Baixo',
    style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40',
    icon: AlertTriangle,
  },
  out_of_stock: {
    label: 'Sem Estoque',
    style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40',
    icon: AlertOctagon,
  },
};

export function InventoryTable({ items, onSelectItem }: InventoryTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (items.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhum item encontrado no estoque
        </p>
        <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] mt-1">
          Tente ajustar a busca ou os filtros de tipo e situação.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[11px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              <th className="py-3.5 px-4 sm:px-6">Item</th>
              <th className="py-3.5 px-4 text-center">Tipo</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">Unidade</th>
              <th className="py-3.5 px-4 text-center">Estoque Atual</th>
              <th className="py-3.5 px-4 text-center hidden sm:table-cell">Estoque Mínimo</th>
              <th className="py-3.5 px-4 text-right hidden lg:table-cell">Custo Unitário</th>
              <th className="py-3.5 px-4 text-right">Valor em Estoque</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {items.map((item) => {
              const typeCfg = TYPE_CONFIG[item.type];
              const statusCfg = STATUS_CONFIG[item.status];
              const StatusIcon = statusCfg.icon;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Item & SKU */}
                  <td className="py-4 px-4 sm:px-6">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[200px] sm:max-w-[260px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75] font-mono">
                      {item.sku} {item.category ? `• ${item.category}` : ''}
                    </p>
                  </td>

                  {/* Tipo (Produto / Material / Embalagem) */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${typeCfg.style}`}>
                      {typeCfg.label}
                    </span>
                  </td>

                  {/* Unidade */}
                  <td className="py-4 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] hidden md:table-cell">
                    {item.unit}
                  </td>

                  {/* Estoque Atual com destaque */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`font-extrabold text-sm ${
                        item.status === 'out_of_stock'
                          ? 'text-rose-600 dark:text-rose-400'
                          : item.status === 'low_stock'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#2a221b] dark:text-[#f5f0eb]'
                      }`}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </td>

                  {/* Estoque Mínimo */}
                  <td className="py-4 px-4 text-center text-[#8c7f74] dark:text-[#8a7f75] hidden sm:table-cell">
                    {item.minStock} {item.unit}
                  </td>

                  {/* Custo Unitário */}
                  <td className="py-4 px-4 text-right font-medium text-[#63574d] dark:text-[#c4b9ae] hidden lg:table-cell whitespace-nowrap">
                    {formatCurrency(item.unitCost)}
                  </td>

                  {/* Valor Total em Estoque */}
                  <td className="py-4 px-4 text-right font-bold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(item.totalValue)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${statusCfg.style}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusCfg.label}</span>
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="p-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c] transition-colors"
                      title="Ver detalhes do estoque"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination / Total Bar */}
      <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
        <span>
          Mostrando {items.length} itens de estoque (produtos, insumos e embalagens)
        </span>
        <div className="flex items-center gap-1">
          <button disabled className="px-3 py-1 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] opacity-50 cursor-not-allowed">
            Anterior
          </button>
          <button className="px-3 py-1 rounded-lg border border-[#235347] bg-[#235347] text-white font-semibold">
            1
          </button>
          <button disabled className="px-3 py-1 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] opacity-50 cursor-not-allowed">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
