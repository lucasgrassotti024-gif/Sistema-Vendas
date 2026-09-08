'use client';

import React from 'react';
import { SaleData, SaleStatus } from '@/types/sales';
import { Eye, ArrowUpDown } from 'lucide-react';

interface SalesTableProps {
  sales: SaleData[];
  onSelectSale: (sale: SaleData) => void;
}

const STATUS_BADGES: Record<SaleStatus, { label: string; style: string }> = {
  paid: {
    label: 'Pago',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  partial: {
    label: 'Parcial',
    style: 'bg-[#faf5e8] text-[#c29b38] dark:bg-[#2c2415] dark:text-[#d4ac4a] border border-amber-300/40 dark:border-amber-700/40',
  },
  pending: {
    label: 'Pendente',
    style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300/40 dark:border-rose-700/40',
  },
  cancelled: {
    label: 'Cancelado',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};

export function SalesTable({ sales, onSelectSale }: SalesTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (iso: string) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  if (sales.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhuma venda encontrada
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
              <th className="py-3.5 px-4 sm:px-6">Nº Venda</th>
              <th className="py-3.5 px-4">Data</th>
              <th className="py-3.5 px-4">Cliente</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Itens</th>
              <th className="py-3.5 px-4 text-right">Valor Total</th>
              <th className="py-3.5 px-4 text-right hidden sm:table-cell">Valor Pago</th>
              <th className="py-3.5 px-4 text-right hidden lg:table-cell">A Receber</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {sales.map((sale) => {
              const badge = STATUS_BADGES[sale.status];
              const totalItemsCount = sale.items.reduce((acc, it) => acc + it.quantity, 0);

              return (
                <tr
                  key={sale.id}
                  onClick={() => onSelectSale(sale)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Código da Venda */}
                  <td className="py-4 px-4 sm:px-6 font-bold text-[#235347] dark:text-[#377d6c]">
                    {sale.code}
                  </td>

                  {/* Data */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                    {formatDate(sale.date)}
                  </td>

                  {/* Cliente */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[150px] sm:max-w-[200px]">
                      {sale.customerName}
                    </p>
                    {sale.customerPhone && (
                      <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75]">
                        {sale.customerPhone}
                      </p>
                    )}
                  </td>

                  {/* Itens */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] hidden md:table-cell whitespace-nowrap">
                    {totalItemsCount} un ({sale.items.length} {sale.items.length === 1 ? 'tipo' : 'tipos'})
                  </td>

                  {/* Valor Total */}
                  <td className="py-4 px-4 text-right font-bold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {formatCurrency(sale.totalAmount)}
                  </td>

                  {/* Valor Pago */}
                  <td className="py-4 px-4 text-right font-semibold text-emerald-700 dark:text-emerald-400 hidden sm:table-cell whitespace-nowrap">
                    {formatCurrency(sale.amountPaid)}
                  </td>

                  {/* Valor a Receber */}
                  <td className="py-4 px-4 text-right font-semibold text-[#c29b38] dark:text-[#d4ac4a] hidden lg:table-cell whitespace-nowrap">
                    {sale.remainingBalance > 0 ? formatCurrency(sale.remainingBalance) : '-'}
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
                        onSelectSale(sale);
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
        <span>Mostrando 1 a {sales.length} de {sales.length} vendas registradas</span>
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
