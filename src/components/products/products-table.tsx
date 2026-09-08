'use client';

import React from 'react';
import { ProductData, ProductStatus } from '@/types/products';
import { Eye, AlertTriangle } from 'lucide-react';

interface ProductsTableProps {
  products: ProductData[];
  onSelectProduct: (product: ProductData) => void;
}

const STATUS_BADGES: Record<ProductStatus, { label: string; style: string }> = {
  active: {
    label: 'Ativo',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  inactive: {
    label: 'Inativo',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};

export function ProductsTable({ products, onSelectProduct }: ProductsTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (products.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhum produto encontrado
        </p>
        <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] mt-1">
          Tente ajustar os termos de busca ou filtros selecionados.
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
              <th className="py-3.5 px-4 sm:px-6">Produto</th>
              <th className="py-3.5 px-4">Categoria</th>
              <th className="py-3.5 px-4 text-right">Preço de Venda</th>
              <th className="py-3.5 px-4 text-right hidden sm:table-cell">Custo Atual</th>
              <th className="py-3.5 px-4 text-right hidden md:table-cell">Margem</th>
              <th className="py-3.5 px-4 text-center">Estoque</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell">Unidade</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {products.map((prod) => {
              const badge = STATUS_BADGES[prod.status];
              const isLowStock = prod.currentStock <= prod.minStock;

              return (
                <tr
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Produto & SKU */}
                  <td className="py-4 px-4 sm:px-6">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[180px] sm:max-w-[240px]">
                      {prod.name}
                    </p>
                    <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75] font-mono">
                      {prod.code}
                    </p>
                  </td>

                  {/* Categoria */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                    {prod.category}
                  </td>

                  {/* Preço de Venda */}
                  <td className="py-4 px-4 text-right font-bold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(prod.salePrice)}
                  </td>

                  {/* Custo Atual */}
                  <td className="py-4 px-4 text-right font-semibold text-[#4a2e18] dark:text-[#d4a373] hidden sm:table-cell whitespace-nowrap">
                    {formatCurrency(prod.currentCost)}
                  </td>

                  {/* Margem */}
                  <td className="py-4 px-4 text-right font-bold text-[#2c4a6f] dark:text-[#6ba1d6] hidden md:table-cell whitespace-nowrap">
                    {prod.marginPercent.toFixed(1)}%
                  </td>

                  {/* Estoque com Alerta Visual */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 font-bold">
                      <span
                        className={`${
                          isLowStock
                            ? 'text-amber-700 dark:text-amber-400 font-extrabold'
                            : 'text-[#2a221b] dark:text-[#f5f0eb]'
                        }`}
                      >
                        {prod.currentStock} {prod.unit}
                      </span>
                      {isLowStock && (
                        <span title="Estoque abaixo do mínimo">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Unidade */}
                  <td className="py-4 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] hidden lg:table-cell">
                    {prod.unit}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(prod);
                      }}
                      className="p-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c] transition-colors"
                      title="Ver detalhes"
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

      {/* Pagination Bar */}
      <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
        <span>Mostrando 1 a {products.length} de {products.length} produtos catalogados</span>
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
