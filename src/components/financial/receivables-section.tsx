'use client';

import React from 'react';
import { TitleReceivable, TITLE_STATUS_CONFIG } from '@/types/financial';
import { PlusCircle, Eye } from 'lucide-react';

interface ReceivablesSectionProps {
  receivables: TitleReceivable[];
  onSelectReceivable: (receivable: TitleReceivable) => void;
  onOpenPaymentModal: (receivable: TitleReceivable) => void;
}

export function ReceivablesSection({
  receivables,
  onSelectReceivable,
  onOpenPaymentModal,
}: ReceivablesSectionProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (receivables.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border bg-white dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-xs text-[#8c7f74]">Nenhum título a receber em aberto.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[11px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              <th className="py-3.5 px-4 sm:px-6">Cliente</th>
              <th className="py-3.5 px-4">Origem / Referência</th>
              <th className="py-3.5 px-4 text-center">Vencimento</th>
              <th className="py-3.5 px-4 text-right">Valor Original</th>
              <th className="py-3.5 px-4 text-right">Recebido</th>
              <th className="py-3.5 px-4 text-right">Saldo Restante</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
            {receivables.map((rec) => {
              const statusCfg = TITLE_STATUS_CONFIG[rec.status];
              const isPaid = rec.status === 'pago';

              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectReceivable(rec)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Cliente */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {rec.clientName}
                  </td>

                  {/* Origem */}
                  <td className="py-3.5 px-4 text-[#63574d] dark:text-[#c4b9ae]">
                    {rec.origin}
                  </td>

                  {/* Vencimento */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-[#63574d] dark:text-[#c4b9ae]">
                    {rec.dueDate}
                  </td>

                  {/* Valor Original */}
                  <td className="py-3.5 px-4 text-right font-semibold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {formatCurrency(rec.originalAmount)}
                  </td>

                  {/* Valor Recebido */}
                  <td className="py-3.5 px-4 text-right font-semibold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                    {formatCurrency(rec.receivedAmount)}
                  </td>

                  {/* Saldo Restante */}
                  <td className="py-3.5 px-4 text-right font-extrabold whitespace-nowrap">
                    <span
                      className={
                        rec.balanceDue > 0
                          ? 'text-[#c29b38] dark:text-[#d4ac4a]'
                          : 'text-[#8c7f74]'
                      }
                    >
                      {formatCurrency(rec.balanceDue)}
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
                      {!isPaid && rec.balanceDue > 0 && (
                        <button
                          type="button"
                          onClick={() => onOpenPaymentModal(rec)}
                          className="px-2.5 py-1 rounded-lg bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                          title="Dar baixa ou receber parcial"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Receber</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectReceivable(rec)}
                        className="p-1 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c]"
                        title="Ver detalhes do título"
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
