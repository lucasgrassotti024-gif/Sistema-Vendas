'use client';

import React from 'react';
import { PurchaseOrder, PURCHASE_STATUS_CONFIG } from '@/types/purchases';
import {
  X,
  Calendar,
  Building2,
  DollarSign,
  Layers,
  History,
  AlertCircle,
  Clock,
  Ban,
} from 'lucide-react';

interface PurchaseDetailsDrawerProps {
  purchase: PurchaseOrder | null;
  onClose: () => void;
  onOpenCancel: (purchase: PurchaseOrder) => void;
}

export function PurchaseDetailsDrawer({
  purchase,
  onClose,
  onOpenCancel,
}: PurchaseDetailsDrawerProps) {
  if (!purchase) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const statusCfg = PURCHASE_STATUS_CONFIG[purchase.status];
  const isCancelled = purchase.status === 'cancelled';

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
              <span className="font-mono text-sm font-bold text-[#8c7f74] dark:text-[#8a7f75]">
                {purchase.purchaseNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${statusCfg.style}`}>
                {statusCfg.label}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb] mt-0.5 truncate max-w-[280px]">
              {purchase.supplierName}
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
          {/* Ação de Cancelamento */}
          {!isCancelled && (
            <button
              onClick={() => onOpenCancel(purchase)}
              className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-rose-100 dark:hover:bg-rose-950/40"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Solicitar Cancelamento da Compra</span>
            </button>
          )}

          {/* Banner de Cancelamento */}
          {isCancelled && (
            <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Compra Cancelada em {purchase.cancelledAt}</span>
              </div>
              <p className="text-[11px] opacity-90">
                <strong>Motivo:</strong> {purchase.cancelReason || 'Cancelamento solicitado pelo gestor.'}
              </p>
            </div>
          )}

          {/* Resumo Financeiro da Compra */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3 shadow-xs">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#235347]" />
              <span>Composição Financeira da Compra</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#63574d] dark:text-[#c4b9ae]">
                <span>Subtotal dos Itens:</span>
                <span className="font-semibold">{formatCurrency(purchase.subtotal)}</span>
              </div>

              {purchase.discount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Desconto Comercial:</span>
                  <span>- {formatCurrency(purchase.discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-extrabold text-sm text-[#2a221b] dark:text-[#f5f0eb] pt-1.5 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
                <span>Valor Total da Compra:</span>
                <span>{formatCurrency(purchase.totalAmount)}</span>
              </div>
            </div>

            {/* Divisão Pago vs A Pagar */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
              <div className="p-2 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] text-center">
                <span className="text-[10px] uppercase font-bold text-[#235347] dark:text-[#377d6c] block">
                  Valor Pago
                </span>
                <span className="text-sm font-extrabold text-[#235347] dark:text-emerald-400 mt-0.5 block">
                  {formatCurrency(purchase.paidAmount)}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#faf5e8] dark:bg-[#2c2415] text-center">
                <span className="text-[10px] uppercase font-bold text-[#c29b38] dark:text-[#d4ac4a] block">
                  Saldo a Pagar
                </span>
                <span className="text-sm font-extrabold text-[#c29b38] dark:text-[#d4ac4a] mt-0.5 block">
                  {formatCurrency(purchase.balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Tabela de Itens Adquiridos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#2c4a6f]" />
              <span>Itens da Compra ({purchase.items.length})</span>
            </h4>

            <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[10px] font-bold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3 text-center">Tipo</th>
                    <th className="py-2.5 px-3 text-center">Qtd</th>
                    <th className="py-2.5 px-3 text-right">Custo Unit.</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
                  {purchase.items.map((it) => (
                    <tr key={it.id} className="hover:bg-[#f1ede4]/30 dark:hover:bg-[#23201c]/30">
                      <td className="py-2.5 px-3 font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                        {it.name}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {it.type === 'material' ? 'Material' : it.type === 'packaging' ? 'Embalagem' : 'Outro'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {formatCurrency(it.unitCost)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                        {formatCurrency(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#8c7f74] italic">
              * A entrada física e baixa de insumos no estoque é gerenciada após a conferência na doca de recebimento.
            </p>
          </div>

          {/* Histórico de Eventos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#c29b38]" />
              <span>Linha do Tempo da Compra ({purchase.history.length})</span>
            </h4>

            <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
              {purchase.history.map((ev) => (
                <div key={ev.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2a221b] dark:text-[#f5f0eb]">
                      {ev.title}
                    </span>
                    <span className="text-[10px] text-[#8c7f74]">{ev.date}</span>
                  </div>
                  <p className="text-[11px] text-[#63574d] dark:text-[#c4b9ae]">
                    {ev.description}
                  </p>
                  <p className="text-[10px] text-[#8c7f74] pt-0.5">
                    Por: {ev.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
