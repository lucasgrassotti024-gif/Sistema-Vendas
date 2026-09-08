'use client';

import React from 'react';
import {
  FinancialTransaction,
  TitleReceivable,
  TitlePayable,
  TITLE_STATUS_CONFIG,
} from '@/types/financial';
import { X, Calendar, DollarSign, ArrowDownRight, ArrowUpRight, History, CreditCard } from 'lucide-react';

interface FinancialDetailsDrawerProps {
  selectedItem:
    | { type: 'transaction'; data: FinancialTransaction }
    | { type: 'receivable'; data: TitleReceivable }
    | { type: 'payable'; data: TitlePayable }
    | null;
  onClose: () => void;
  onOpenPayment: (item: TitleReceivable | TitlePayable, type: 'receivable' | 'payable') => void;
}

export function FinancialDetailsDrawer({
  selectedItem,
  onClose,
  onOpenPayment,
}: FinancialDetailsDrawerProps) {
  if (!selectedItem) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const isTx = selectedItem.type === 'transaction';
  const isRec = selectedItem.type === 'receivable';
  const isPay = selectedItem.type === 'payable';

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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {isTx ? 'Movimentação' : isRec ? 'Título a Receber' : 'Título a Pagar'}
              </span>
              {!isTx && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    TITLE_STATUS_CONFIG[
                      (selectedItem.data as TitleReceivable | TitlePayable).status
                    ]?.style
                  }`}
                >
                  {
                    TITLE_STATUS_CONFIG[
                      (selectedItem.data as TitleReceivable | TitlePayable).status
                    ]?.label
                  }
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb] mt-1 truncate max-w-[280px]">
              {isTx
                ? (selectedItem.data as FinancialTransaction).description
                : isRec
                ? (selectedItem.data as TitleReceivable).clientName
                : (selectedItem.data as TitlePayable).supplierName}
            </h3>
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
          {/* Ação de Pagamento / Recebimento */}
          {!isTx &&
            (selectedItem.data as TitleReceivable | TitlePayable).balanceDue > 0 && (
              <button
                onClick={() =>
                  onOpenPayment(
                    selectedItem.data as TitleReceivable | TitlePayable,
                    isRec ? 'receivable' : 'payable'
                  )
                }
                className={`w-full py-2.5 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors ${
                  isRec
                    ? 'bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c]'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isRec ? 'Registrar Recebimento Deste Título' : 'Efetuar Pagamento Deste Título'}
                </span>
              </button>
            )}

          {/* Cards de Valores */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3 shadow-xs">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              Posição Financeira
            </h4>

            {isTx ? (
              /* Transação Realizada */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8c7f74]">Valor Liquidado:</span>
                  <strong
                    className={`text-lg font-extrabold ${
                      (selectedItem.data as FinancialTransaction).type === 'entrada'
                        ? 'text-[#235347] dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {(selectedItem.data as FinancialTransaction).type === 'entrada' ? '+' : '-'}{' '}
                    {formatCurrency((selectedItem.data as FinancialTransaction).amount)}
                  </strong>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
                  <div>
                    <span className="text-[10px] text-[#8c7f74] block uppercase">Data</span>
                    <strong className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
                      {(selectedItem.data as FinancialTransaction).date}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8c7f74] block uppercase">Categoria</span>
                    <strong className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
                      {(selectedItem.data as FinancialTransaction).category}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              /* Título a Receber ou Pagar */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8c7f74]">Valor Original do Título:</span>
                  <strong className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {formatCurrency(
                      (selectedItem.data as TitleReceivable | TitlePayable).originalAmount
                    )}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
                  <div className="p-2.5 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#235347] dark:text-[#377d6c] block">
                      {isRec ? 'Recebido' : 'Pago'}
                    </span>
                    <strong className="text-sm font-extrabold text-[#235347] dark:text-emerald-400 block mt-0.5">
                      {formatCurrency(
                        isRec
                          ? (selectedItem.data as TitleReceivable).receivedAmount
                          : (selectedItem.data as TitlePayable).paidAmount
                      )}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#faf5e8] dark:bg-[#2c2415] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#c29b38] dark:text-[#d4ac4a] block">
                      Saldo Restante
                    </span>
                    <strong className="text-sm font-extrabold text-[#c29b38] dark:text-[#d4ac4a] block mt-0.5">
                      {formatCurrency(
                        (selectedItem.data as TitleReceivable | TitlePayable).balanceDue
                      )}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex justify-between text-[#8c7f74]">
                  <span>Vencimento Programado:</span>
                  <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                    {(selectedItem.data as TitleReceivable | TitlePayable).dueDate}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Origem e Detalhes */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-2 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              Vínculo Operacional
            </span>
            <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">
              {isTx
                ? (selectedItem.data as FinancialTransaction).referenceId || 'Lançamento Operacional Direto'
                : (selectedItem.data as TitleReceivable | TitlePayable).origin}
            </p>
            {selectedItem.data.notes && (
              <p className="text-[11px] text-[#8c7f74] pt-1 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
                <strong>Observação:</strong> {selectedItem.data.notes}
              </p>
            )}
          </div>

          {/* Histórico Imutável */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#c29b38]" />
              <span>Registro de Fatos Financeiros</span>
            </h4>
            <div className="p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-xs text-[#63574d] dark:text-[#c4b9ae] space-y-1">
              <p>
                ✓ Registro original gravado com autenticação e trilha de auditoria.
              </p>
              <p className="text-[11px] text-[#8c7f74]">
                Fatos financeiros não são livremente editados para garantir conformidade entre entradas, saídas e conciliação bancária.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
