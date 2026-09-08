'use client';

import React from 'react';
import { TitlePayable, TITLE_STATUS_CONFIG } from '@/types/financial';
import { PlusCircle, Eye } from 'lucide-react';

interface PayablesSectionProps {
  payables: TitlePayable[];
  onSelectPayable: (payable: TitlePayable) => void;
  onOpenPaymentModal: (payable: TitlePayable) => void;
}

export function PayablesSection({
  payables,
  onSelectPayable,
  onOpenPaymentModal,
}: PayablesSectionProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (payables.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border bg-white dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-xs text-[#8c7f74]">Nenhum título a pagar em aberto.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[11px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              <th className="py-3.5 px-4 sm:px-6">Fornecedor / Favorecido</th>
              <th className="py-3.5 px-4">Descrição / Origem</th>
              <th className="py-3.5 px-4 text-center">Vencimento</th>
              <th className="py-3.5 px-4 text-right">Valor Original</th>
              <th className="py-3.5 px-4 text-right">Valor Pago</th>
              <th className="py-3.5 px-4 text-right">Saldo Devedor</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
            {payables.map((pay) => {
              const statusCfg = TITLE_STATUS_CONFIG[pay.status];
              const isPaid = pay.status === 'pago';

              return (
                <tr
                  key={pay.id}
                  onClick={() => onSelectPayable(pay)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Fornecedor */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {pay.supplierName}
                  </td>

                  {/* Descrição */}
                  <td className="py-3.5 px-4 text-[#63574d] dark:text-[#c4b9ae]">
                    {pay.description}
                  </td>

                  {/* Vencimento */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-[#63574d] dark:text-[#c4b9ae]">
                    {pay.dueDate}
                  </td>

                  {/* Valor Original */}
                  <td className="py-3.5 px-4 text-right font-semibold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {formatCurrency(pay.originalAmount)}
                  </td>

                  {/* Valor Pago */}
                  <td className="py-3.5 px-4 text-right font-semibold text-rose-700 dark:text-rose-400 whitespace-nowrap">
                    {formatCurrency(pay.paidAmount)}
                  </td>

                  {/* Saldo Devedor */}
                  <td className="py-3.5 px-4 text-right font-extrabold whitespace-nowrap">
                    <span
                      className={
                        pay.balanceDue > 0
                          ? 'text-[#c29b38] dark:text-[#d4ac4a]'
                          : 'text-[#8c7f74]'
                      }
                    >
                      {formatCurrency(pay.balanceDue)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${statusCfg.style}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isPaid && pay.balanceDue > 0 && (
                        <button
                          type="button"
                          onClick={() => onOpenPaymentModal(pay)}
                          className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                          title="Efetuar pagamento parcial ou total"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Pagar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPayable(pay)}
                        className="p-1 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c]"
                        title="Ver detalhes da conta a pagar"
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
    </div>
  );
}
