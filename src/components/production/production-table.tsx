'use client';

import React from 'react';
import { ProductionOrder, STATUS_LABELS } from '@/types/production';
import { Eye, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface ProductionTableProps {
  orders: ProductionOrder[];
  onSelectOrder: (order: ProductionOrder) => void;
  onFinalizeOrder: (order: ProductionOrder) => void;
}

export function ProductionTable({
  orders,
  onSelectOrder,
  onFinalizeOrder,
}: ProductionTableProps) {
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhuma ordem de produção encontrada
        </p>
        <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] mt-1">
          Ajuste os filtros de busca, status ou período.
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
              <th className="py-3.5 px-4 sm:px-6">Nº Ordem</th>
              <th className="py-3.5 px-4">Produto</th>
              <th className="py-3.5 px-4 text-center">Planejada</th>
              <th className="py-3.5 px-4 text-center">Produzida</th>
              <th className="py-3.5 px-4 text-center hidden sm:table-cell">Data Prog.</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">Conclusão</th>
              <th className="py-3.5 px-4 text-left hidden lg:table-cell">Responsável</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {orders.map((ord) => {
              const badge = STATUS_LABELS[ord.status];
              const isCompleted = ord.status === 'completed';
              const isInProgress = ord.status === 'in_production';

              return (
                <tr
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Nº da Produção */}
                  <td className="py-4 px-4 sm:px-6 font-bold font-mono text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {ord.orderNumber}
                  </td>

                  {/* Produto */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[180px] sm:max-w-[240px]">
                      {ord.productName}
                    </p>
                    {ord.notes && (
                      <p className="text-[10px] text-[#8c7f74] truncate max-w-[200px]">
                        {ord.notes}
                      </p>
                    )}
                  </td>

                  {/* Quantidade Planejada */}
                  <td className="py-4 px-4 text-center font-semibold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                    {ord.plannedQuantity} un
                  </td>

                  {/* Quantidade Produzida */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`font-extrabold ${
                        isCompleted
                          ? 'text-[#235347] dark:text-emerald-400'
                          : isInProgress
                          ? 'text-[#2c4a6f] dark:text-[#6ba1d6]'
                          : 'text-[#8c7f74]'
                      }`}
                    >
                      {ord.producedQuantity} un
                    </span>
                    {ord.lostQuantity && ord.lostQuantity > 0 ? (
                      <span className="text-[10px] text-rose-600 block">
                        (-{ord.lostQuantity} perdas)
                      </span>
                    ) : null}
                  </td>

                  {/* Data Programada */}
                  <td className="py-4 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] hidden sm:table-cell whitespace-nowrap">
                    {ord.scheduledDate}
                  </td>

                  {/* Data de Conclusão */}
                  <td className="py-4 px-4 text-center text-[#8c7f74] dark:text-[#8a7f75] hidden md:table-cell whitespace-nowrap">
                    {ord.completedDate || '—'}
                  </td>

                  {/* Responsável */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] hidden lg:table-cell whitespace-nowrap">
                    {ord.responsibleName}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!isCompleted && ord.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => onFinalizeOrder(ord)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                          title="Finalizar e apontar produção"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Finalizar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectOrder(ord)}
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
        <span>Mostrando {orders.length} ordens de produção registradas</span>
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
