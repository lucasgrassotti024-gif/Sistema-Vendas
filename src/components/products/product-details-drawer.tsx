'use client';

import React from 'react';
import { ProductData } from '@/types/products';
import {
  X,
  DollarSign,
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Edit,
  Power,
  Info,
} from 'lucide-react';

interface ProductDetailsDrawerProps {
  product: ProductData | null;
  onClose: () => void;
  onEdit: (product: ProductData) => void;
  onToggleStatus: (productId: string) => void;
}

export function ProductDetailsDrawer({
  product,
  onClose,
  onEdit,
  onToggleStatus,
}: ProductDetailsDrawerProps) {
  if (!product) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const isLowStock = product.status === 'active' && product.currentStock <= product.minStock;

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'entrada':
        return { label: 'Entrada', style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' };
      case 'saida':
        return { label: 'Saída', style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' };
      case 'venda':
        return { label: 'Venda', style: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' };
      case 'devolucao':
        return { label: 'Devolução', style: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' };
      case 'ajuste':
      default:
        return { label: 'Ajuste', style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' };
    }
  };

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
                {product.name}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  product.status === 'active'
                    ? 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {product.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] font-mono">
              SKU: {product.code} • {product.category}
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
          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-2 px-3 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] hover:bg-stone-100 dark:hover:bg-[#25211d] text-[#2a221b] dark:text-[#f5f0eb] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 text-[#2c4a6f]" />
              <span>Editar Produto</span>
            </button>
            <button
              onClick={() => onToggleStatus(product.id)}
              className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                product.status === 'active'
                  ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                  : 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{product.status === 'active' ? 'Inativar' : 'Ativar'}</span>
            </button>
          </div>

          {/* Descrição & Observações */}
          <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-2">
            <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Descrição do Produto
            </span>
            <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
              {product.description || 'Nenhuma descrição detalhada informada.'}
            </p>
            {product.notes && (
              <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex items-start gap-1.5 text-[11px] text-[#8c7f74]">
                <Info className="w-3.5 h-3.5 shrink-0 text-[#c29b38] mt-0.5" />
                <span>{product.notes}</span>
              </div>
            )}
          </div>

          {/* Composição Comercial: Preço de Venda vs. Custo vs. Margem */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#235347]" />
              <span>Análise Comercial e Margem</span>
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Preço de Venda */}
              <div className="p-3.5 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Preço Venda</span>
                <span className="text-base font-bold text-[#235347] dark:text-emerald-400 mt-1 block">
                  {formatCurrency(product.salePrice)}
                </span>
              </div>

              {/* Custo Atual */}
              <div className="p-3.5 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Custo Atual</span>
                <span className="text-base font-bold text-[#4a2e18] dark:text-[#d4a373] mt-1 block">
                  {formatCurrency(product.currentCost)}
                </span>
              </div>

              {/* Margem Bruta Estimada */}
              <div className="p-3.5 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">Margem</span>
                <span className="text-base font-bold text-[#2c4a6f] dark:text-[#6ba1d6] mt-1 block">
                  {product.marginPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#faf5e8] dark:bg-[#2c2415] border border-amber-300/40 text-[#c29b38] dark:text-[#d4ac4a] flex items-center justify-between">
              <span>Lucro Bruto Unitário Estimado:</span>
              <strong className="text-sm">
                {formatCurrency(product.salePrice - product.currentCost)} / {product.unit}
              </strong>
            </div>
          </div>

          {/* Situação do Estoque */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#4a2e18]" />
              <span>Posição de Estoque Persistente</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#63574d] dark:text-[#c4b9ae]">Estoque Físico Disponível:</span>
                <span className="font-extrabold text-base text-[#2a221b] dark:text-[#f5f0eb]">
                  {product.currentStock} {product.unit}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#63574d] dark:text-[#c4b9ae]">Ponto Mínimo de Alerta:</span>
                <span className="font-semibold text-stone-600 dark:text-stone-300">
                  {product.minStock} {product.unit}
                </span>
              </div>

              {/* Status do Estoque */}
              {isLowStock ? (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold">Atenção: Estoque Baixo</p>
                    <p className="text-[11px] opacity-90">
                      O saldo atual ({product.currentStock} {product.unit}) está no limite ou abaixo do mínimo ({product.minStock} {product.unit}).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Estoque adequado e dentro da margem de segurança.</span>
                </div>
              )}
            </div>
          </div>

          {/* Histórico Real de Movimentações (Ledger) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#c29b38]" />
              <span>Histórico de Movimentações ({product.history.length})</span>
            </h4>
            {product.history.length > 0 ? (
              <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
                {product.history.map((h) => {
                  const badge = getMovementBadge(h.type);
                  return (
                    <div key={h.id} className="p-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase ${badge.style}`}>
                            {badge.label}
                          </span>
                          <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                            {h.description}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#8c7f74]">{h.date}</p>
                      </div>
                      <span
                        className={`font-bold text-sm ${
                          h.quantityChange > 0
                            ? 'text-[#235347] dark:text-emerald-400'
                            : h.quantityChange < 0
                            ? 'text-rose-700 dark:text-rose-400'
                            : 'text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange} {product.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-center text-[#8c7f74]">
                Sem movimentações registradas neste produto.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
