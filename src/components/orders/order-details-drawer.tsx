'use client';

import React from 'react';
import { OrderData, OrderStatus } from '@/types/orders';
import {
  X,
  Calendar,
  User,
  DollarSign,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ORDER_STATUS_BADGES } from './orders-table';

interface OrderDetailsDrawerProps {
  order: OrderData | null;
  onClose: () => void;
}

const FLOW_STAGES: { key: OrderStatus; label: string }[] = [
  { key: 'new', label: 'Criado' },
  { key: 'confirmed', label: 'Confirmado' },
  { key: 'in_production', label: 'Em Produção' },
  { key: 'ready', label: 'Pronto' },
  { key: 'delivered', label: 'Entregue' },
];

export function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const badge = ORDER_STATUS_BADGES[order.status];

  // Identifica o índice da fase atual do fluxo
  const currentStageIndex = FLOW_STAGES.findIndex((s) => s.key === order.status);

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
                {order.code}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${badge.style}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
              Detalhes operacionais e fluxo de atendimento
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
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Visualizador de Andamento do Fluxo */}
          {order.status !== 'cancelled' ? (
            <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8c7f74] dark:text-[#8a7f75]">
                Andamento da Encomenda
              </span>
              <div className="relative flex items-center justify-between">
                {/* Linha de Conexão */}
                <div className="absolute top-1/2 left-2 right-2 h-0.5 -translate-y-1/2 bg-[#e5dfd3] dark:bg-[#38322c] z-0" />

                {FLOW_STAGES.map((stage, idx) => {
                  const isCompleted = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={stage.key} className="relative z-10 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                          isCurrent
                            ? 'bg-[#235347] text-white ring-4 ring-[#235347]/20 dark:bg-[#377d6c]'
                            : isCompleted
                            ? 'bg-[#235347] text-white dark:bg-[#377d6c]'
                            : 'bg-[#f1ede4] text-[#8c7f74] dark:bg-[#23201c] dark:text-[#8a7f75] border border-[#e5dfd3] dark:border-[#38322c]'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[9px] font-semibold text-center max-w-[56px] leading-tight ${
                          isCurrent
                            ? 'text-[#235347] dark:text-[#377d6c]'
                            : 'text-[#8c7f74] dark:text-[#8a7f75]'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Pedido Cancelado</p>
                <p className="text-[11px] opacity-90">Este pedido foi cancelado e não prosseguirá para produção.</p>
              </div>
            </div>
          )}

          {/* Informações Gerais */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c]">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Cliente
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                <User className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span className="truncate">{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <p className="text-[10px] text-[#8c7f74]">{order.customerPhone}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Data Prevista de Entrega
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                <Calendar className="w-3.5 h-3.5 text-[#235347]" />
                <span>{order.deliveryDate}</span>
              </div>
              <p className="text-[10px] text-[#8c7f74]">Criado em {order.orderDate}</p>
            </div>
          </div>

          {/* Observações */}
          {order.notes && (
            <div className="p-3.5 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c]">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75] block mb-1">
                Observações do Pedido
              </span>
              <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">{order.notes}</p>
            </div>
          )}

          {/* Itens Encomendados e Progresso de Entrega */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#4a2e18]" />
              <span>Itens da Encomenda & Atendimento</span>
            </h4>
            <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
                      {item.productName}
                    </p>
                    <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>

                  {/* Detalhes de Quantidade Encomendada vs Entregue */}
                  <div className="flex items-center justify-between text-[11px] text-[#8c7f74] dark:text-[#8a7f75]">
                    <span>
                      Solicitado: <strong className="text-[#2a221b] dark:text-[#f5f0eb]">{item.quantityOrdered} un</strong>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Entregue: {item.quantityDelivered} un
                    </span>
                    <span className={item.quantityRemaining > 0 ? 'text-[#c29b38] dark:text-[#d4ac4a] font-bold' : 'text-emerald-600'}>
                      Restante: {item.quantityRemaining} un
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Composição Financeira & Sinais */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#235347]" />
              <span>Financeiro & Adiantamentos</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-2.5">
              <div className="flex justify-between text-[#63574d] dark:text-[#c4b9ae]">
                <span>Subtotal dos Itens</span>
                <span>{formatCurrency(order.subtotalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-700 dark:text-rose-400">
                  <span>Desconto Acordado</span>
                  <span>- {formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex justify-between font-bold text-sm text-[#2a221b] dark:text-[#f5f0eb]">
                <span>Total do Pedido</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[#2c4a6f] dark:text-[#446d9b] font-semibold pt-1">
                <span>Adiantamento Recebido (Sinal)</span>
                <span>{formatCurrency(order.advanceReceived)}</span>
              </div>
              <div className="flex justify-between text-[#c29b38] dark:text-[#d4ac4a] font-bold pt-1">
                <span>Saldo Pendente de Faturamento</span>
                <span>{formatCurrency(order.remainingBalance)}</span>
              </div>
            </div>
          </div>

          {/* Histórico e Auditoria */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#c29b38]" />
              <span>Histórico do Pedido</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-3">
              {order.history.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5">
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
