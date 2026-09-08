'use client';

import React from 'react';
import { ProductData } from '@/types/products';
import {
  X,
  Package,
  DollarSign,
  TrendingUp,
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailsDrawerProps {
  product: ProductData | null;
  onClose: () => void;
}

export function ProductDetailsDrawer({ product, onClose }: ProductDetailsDrawerProps) {
  if (!product) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const isLowStock = product.currentStock <= product.minStock;

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
              <h3 className="text-lg font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[320px]">
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
          {/* Descrição */}
          <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-1">
            <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Descrição do Produto
            </span>
            <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
              {product.description}
            </p>
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
              <span>Posição de Estoque</span>
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
                      O saldo atual está abaixo do estoque mínimo. Agende uma nova fornada na produção.
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

          {/* Histórico Recente de Movimentações */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#c29b38]" />
              <span>Movimentações Recentes do Produto</span>
            </h4>
            {product.history.length > 0 ? (
              <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
                {product.history.map((h) => (
                  <div key={h.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                        {h.description}
                      </p>
                      <p className="text-[10px] text-[#8c7f74]">{h.date}</p>
                    </div>
                    <span
                      className={`font-bold ${
                        h.quantityChange > 0
                          ? 'text-[#235347] dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange} {product.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-center text-[#8c7f74]">
                Sem movimentações recentes registradas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
