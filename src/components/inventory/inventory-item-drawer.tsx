'use client';

import React from 'react';
import { InventoryItem, InventoryMovementType } from '@/types/inventory';
import {
  X,
  Layers,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Sliders,
  AlertOctagon,
  Factory,
  PlusCircle,
} from 'lucide-react';

interface InventoryItemDrawerProps {
  item: InventoryItem | null;
  onClose: () => void;
  onOpenMovement: (item: InventoryItem) => void;
}

export function InventoryItemDrawer({
  item,
  onClose,
  onOpenMovement,
}: InventoryItemDrawerProps) {
  if (!item) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getMovementConfig = (type: InventoryMovementType) => {
    switch (type) {
      case 'entrada':
        return {
          label: 'Entrada',
          icon: ArrowDownRight,
          badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        };
      case 'saida':
        return {
          label: 'Saída',
          icon: ArrowUpRight,
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
        };
      case 'perda':
        return {
          label: 'Perda / Avaria',
          icon: AlertOctagon,
          badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
        };
      case 'consumo_producao':
        return {
          label: 'Consumo de Produção',
          icon: Factory,
          badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
        };
      case 'ajuste':
      default:
        return {
          label: 'Ajuste de Inventário',
          icon: Sliders,
          badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        };
    }
  };

  const isLowStock = item.status === 'low_stock';
  const isOutOfStock = item.status === 'out_of_stock';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg h-full flex flex-col bg-[#f8f6f0] dark:bg-[#181614] border-l border-[#e5dfd3] dark:border-[#38322c] shadow-2xl z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between sticky top-0 bg-[#f8f6f0]/90 dark:bg-[#181614]/90 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[280px]">
                {item.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {item.type === 'product'
                  ? 'Produto'
                  : item.type === 'material'
                  ? 'Material'
                  : 'Embalagem'}
              </span>
            </div>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] font-mono">
              SKU: {item.sku} {item.category ? `• ${item.category}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8c7f74] hover:text-[#2a221b] dark:hover:text-[#f5f0eb] hover:bg-[#f1ede4] dark:hover:bg-[#23201c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Ação Rápida */}
          <button
            onClick={() => onOpenMovement(item)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Movimentação neste Item</span>
          </button>

          {/* Cards de Saldo e Valor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
              <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Estoque Atual</span>
              <span
                className={`text-base font-extrabold mt-1 block ${
                  isOutOfStock
                    ? 'text-rose-600'
                    : isLowStock
                    ? 'text-amber-600'
                    : 'text-[#2a221b] dark:text-[#f5f0eb]'
                }`}
              >
                {item.currentStock} {item.unit}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
              <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Estoque Mínimo</span>
              <span className="text-base font-bold text-stone-600 dark:text-stone-300 mt-1 block">
                {item.minStock} {item.unit}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
              <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Custo Unitário</span>
              <span className="text-base font-bold text-[#4a2e18] dark:text-[#d4a373] mt-1 block">
                {formatCurrency(item.unitCost)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
              <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Total Valor</span>
              <span className="text-base font-bold text-[#235347] dark:text-emerald-400 mt-1 block">
                {formatCurrency(item.totalValue)}
              </span>
            </div>
          </div>

          {/* Alerta de Reposição */}
          {(isLowStock || isOutOfStock) && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                isOutOfStock
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isOutOfStock ? (
                <AlertOctagon className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <p className="font-bold">
                  {isOutOfStock ? 'Item Zerado no Estoque Físico' : 'Ponto de Pedido Crítico (Estoque Baixo)'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {isOutOfStock
                    ? 'A produção ou comercialização deste item está comprometida. Providencie reposição emergencial.'
                    : `O saldo atual está abaixo do estoque mínimo (${item.minStock} ${item.unit}). Emita pedido de compra ou ordem de produção.`}
                </p>
              </div>
            </div>
          )}

          {/* Observações */}
          {item.notes && (
            <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Observações de Armazenamento & Reposição
              </span>
              <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">{item.notes}</p>
            </div>
          )}

          {/* Histórico Append-Only de Movimentações */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c29b38]" />
                <span>Livro-Razão de Movimentações ({item.movements.length})</span>
              </h4>
              <span className="text-[10px] text-[#8c7f74] italic">Histórico imutável</span>
            </div>

            {item.movements.length > 0 ? (
              <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
                {item.movements.map((m) => {
                  const cfg = getMovementConfig(m.type);
                  return (
                    <div key={m.id} className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                            {m.reference && (
                              <span className="text-[10px] text-[#8c7f74] font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-sm">
                                Ref: {m.reference}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-xs text-[#2a221b] dark:text-[#f5f0eb]">
                            {m.reason}
                          </p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <span
                            className={`font-extrabold text-sm ${
                              m.quantityChange > 0
                                ? 'text-[#235347] dark:text-emerald-400'
                                : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange} {item.unit}
                          </span>
                          <p className="text-[10px] text-[#8c7f74]">
                            Saldo: {m.resultingBalance} {item.unit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8c7f74] pt-1 border-t border-[#e5dfd3]/30 dark:border-[#38322c]/30">
                        <span>{m.date}</span>
                        {m.createdByName && <span>Registrado por: {m.createdByName}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-center text-[#8c7f74]">
                Nenhuma movimentação registrada para este item.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
