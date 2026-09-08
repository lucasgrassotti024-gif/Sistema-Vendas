'use client';

import React from 'react';
import { CustomerData, CustomerStatus } from '@/types/customers';
import { Eye, Phone, Mail } from 'lucide-react';

interface CustomersTableProps {
  customers: CustomerData[];
  onSelectCustomer: (customer: CustomerData) => void;
}

const STATUS_BADGES: Record<CustomerStatus, { label: string; style: string }> = {
  active: {
    label: 'Ativo',
    style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40 dark:border-emerald-700/40',
  },
  inactive: {
    label: 'Inativo',
    style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40',
  },
};

export function CustomersTable({ customers, onSelectCustomer }: CustomersTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  if (customers.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhum cliente encontrado
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
              <th className="py-3.5 px-4 sm:px-6">Cliente</th>
              <th className="py-3.5 px-4">Telefone</th>
              <th className="py-3.5 px-4 hidden md:table-cell">E-mail</th>
              <th className="py-3.5 px-4 text-center hidden sm:table-cell">Pedidos</th>
              <th className="py-3.5 px-4 text-right">Total Comprado</th>
              <th className="py-3.5 px-4 text-right">A Receber</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Último Pedido</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {customers.map((c) => {
              const badge = STATUS_BADGES[c.status];

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Nome e Documento */}
                  <td className="py-4 px-4 sm:px-6">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[180px] sm:max-w-[220px]">
                      {c.name}
                    </p>
                    {c.document && (
                      <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75]">
                        Doc: {c.document}
                      </p>
                    )}
                  </td>

                  {/* Telefone */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                    {c.phone}
                  </td>

                  {/* E-mail */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] hidden md:table-cell truncate max-w-[160px]">
                    {c.email || '-'}
                  </td>

                  {/* Quantidade de Pedidos */}
                  <td className="py-4 px-4 text-center font-semibold text-[#2a221b] dark:text-[#f5f0eb] hidden sm:table-cell whitespace-nowrap">
                    {c.ordersCount} un
                  </td>

                  {/* Total Comprado */}
                  <td className="py-4 px-4 text-right font-bold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(c.totalPurchasedAmount)}
                  </td>

                  {/* A Receber */}
                  <td className="py-4 px-4 text-right font-bold whitespace-nowrap">
                    {c.totalReceivableAmount > 0 ? (
                      <span className="text-[#c29b38] dark:text-[#d4ac4a]">
                        {formatCurrency(c.totalReceivableAmount)}
                      </span>
                    ) : (
                      <span className="text-stone-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Último Pedido */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] hidden lg:table-cell whitespace-nowrap">
                    {formatDate(c.lastOrderDate)}
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
                        onSelectCustomer(c);
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
        <span>Mostrando 1 a {customers.length} de {customers.length} clientes cadastrados</span>
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
