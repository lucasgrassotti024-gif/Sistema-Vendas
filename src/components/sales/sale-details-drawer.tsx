'use client';

import React from 'react';
import { SaleData } from '@/types/sales';
import { X, Calendar, User, DollarSign, Clock, CheckCircle, Package } from 'lucide-react';

interface SaleDetailsDrawerProps {
  sale: SaleData | null;
  onClose: () => void;
}

export function SaleDetailsDrawer({ sale, onClose }: SaleDetailsDrawerProps) {
  if (!sale) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
              <h3 className="text-lg font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                {sale.code}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]">
                {sale.status}
              </span>
            </div>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
              Detalhes analíticos e histórico da venda
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
        <div className="p-6 space-y-6 flex-1">
          {/* Informações Gerais */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c]">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Data da Venda
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                <Calendar className="w-3.5 h-3.5 text-[#235347]" />
                <span>{sale.date}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Cliente
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                <User className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span className="truncate">{sale.customerName}</span>
              </div>
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#4a2e18]" />
              <span>Itens Faturados</span>
            </h4>
            <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
              {sale.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75]">
                      {item.quantity} un x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#235347]" />
              <span>Composição Financeira</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#63574d] dark:text-[#c4b9ae]">
                <span>Subtotal Bruto</span>
                <span>{formatCurrency(sale.subtotalAmount)}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-rose-700 dark:text-rose-400">
                  <span>Desconto Aplicado</span>
                  <span>- {formatCurrency(sale.discountAmount)}</span>
                </div>
              )}
              {sale.advanceAppliedAmount > 0 && (
                <div className="flex justify-between text-[#2c4a6f] dark:text-[#446d9b]">
                  <span>Sinal/Adiantamento Abatido</span>
                  <span>- {formatCurrency(sale.advanceAppliedAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex justify-between font-bold text-sm text-[#2a221b] dark:text-[#f5f0eb]">
                <span>Total Faturado</span>
                <span>{formatCurrency(sale.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                <span>Valor Efetivamente Pago</span>
                <span>{formatCurrency(sale.amountPaid)}</span>
              </div>
              {sale.remainingBalance > 0 && (
                <div className="flex justify-between text-[#c29b38] dark:text-[#d4ac4a] font-bold pt-1">
                  <span>Saldo a Receber (Fiado)</span>
                  <span>{formatCurrency(sale.remainingBalance)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Histórico e Auditoria */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#c29b38]" />
              <span>Trilha de Eventos</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-3">
              {sale.history.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#235347] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                      {ev.title}
                    </p>
                    <p className="text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                      {ev.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#8c7f74] dark:text-[#8a7f75] shrink-0">
                    {ev.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
