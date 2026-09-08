'use client';

import React from 'react';
import { PurchaseOrder, PURCHASE_STATUS_CONFIG } from '@/types/purchases';
import { Eye, Ban } from 'lucide-react';

interface PurchaseTableProps {
  purchases: PurchaseOrder[];
  onSelectPurchase: (purchase: PurchaseOrder) => void;
  onOpenCancel: (purchase: PurchaseOrder) => void;
}

export function PurchaseTable({
  purchases,
  onSelectPurchase,
  onOpenCancel,
}: PurchaseTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (purchases.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhuma compra encontrada
        </p>
        <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] mt-1">
          Ajuste os filtros de busca, fornecedor, período ou situação.
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
              <th className="py-3.5 px-4 sm:px-6">Nº Compra</th>
              <th className="py-3.5 px-4 text-center">Data</th>
              <th className="py-3.5 px-4">Fornecedor</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">Itens</th>
              <th className="py-3.5 px-4 text-right">Valor Total</th>
              <th className="py-3.5 px-4 text-right hidden sm:table-cell">Valor Pago</th>
              <th className="py-3.5 px-4 text-right">A Pagar</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {purchases.map((pur) => {
              const statusCfg = PURCHASE_STATUS_CONFIG[pur.status];
              const isCancelled = pur.status === 'cancelled';

              return (
                <tr
                  key={pur.id}
                  onClick={() => onSelectPurchase(pur)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Nº da Compra */}
                  <td className="py-4 px-4 sm:px-6 font-bold font-mono text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {pur.purchaseNumber}
                  </td>

                  {/* Data */}
                  <td className="py-4 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                    {pur.date}
                  </td>

                  {/* Fornecedor */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[180px] sm:max-w-[240px]">
                      {pur.supplierName}
                    </p>
                    {pur.supplierDocument && (
                      <p className="text-[10px] text-[#8c7f74] font-mono">
                        {pur.supplierDocument}
                      </p>
                    )}
                  </td>

                  {/* Quantidade de Itens */}
                  <td className="py-4 px-4 text-center hidden md:table-cell whitespace-nowrap">
                    <span className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                      {pur.items.length} {pur.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </td>

                  {/* Valor Total */}
                  <td className="py-4 px-4 text-right font-extrabold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {formatCurrency(pur.totalAmount)}
                  </td>

                  {/* Valor Pago */}
                  <td className="py-4 px-4 text-right font-semibold text-[#235347] dark:text-emerald-400 hidden sm:table-cell whitespace-nowrap">
                    {formatCurrency(pur.paidAmount)}
                  </td>

                  {/* Saldo a Pagar */}
                  <td className="py-4 px-4 text-right font-bold whitespace-nowrap">
                    <span
                      className={
                        pur.balanceDue > 0
                          ? 'text-[#c29b38] dark:text-[#d4ac4a]'
                          : 'text-[#8c7f74]'
                      }
                    >
                      {formatCurrency(pur.balanceDue)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${statusCfg.style}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => onOpenCancel(pur)}
                          className="p-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Cancelar compra"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPurchase(pur)}
                        className="p-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c] transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
        <span>Mostrando {purchases.length} compras registradas no período</span>
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
