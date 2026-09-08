'use client';

import React from 'react';
import { CustomerData } from '@/types/customers';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

interface CustomerDetailsDrawerProps {
  customer: CustomerData | null;
  onClose: () => void;
  onStartOrder?: (customer: CustomerData) => void;
}

export function CustomerDetailsDrawer({
  customer,
  onClose,
  onStartOrder,
}: CustomerDetailsDrawerProps) {
  if (!customer) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

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
              <h3 className="text-lg font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[320px]">
                {customer.name}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  customer.status === 'active'
                    ? 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {customer.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
              Cadastrado em {formatDate(customer.createdAt)}
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
          {/* Ação Rápida: Iniciar Novo Pedido */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#235347]/10 dark:bg-[#377d6c]/15 border border-[#235347]/20 dark:border-[#377d6c]/30">
            <div>
              <p className="font-bold text-[#235347] dark:text-[#377d6c]">
                Criar Encomenda para este Cliente
              </p>
              <p className="text-[11px] text-[#63574d] dark:text-[#c4b9ae]">
                Inicie um novo pedido com os dados pré-carregados
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartOrder && onStartOrder(customer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-semibold transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Pedido</span>
            </button>
          </div>

          {/* Dados de Contato e Documento */}
          <div className="p-4 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8c7f74] dark:text-[#8a7f75] block mb-1">
              Contato & Identificação
            </span>
            <div className="flex items-center gap-2 text-[#2a221b] dark:text-[#f5f0eb]">
              <Phone className="w-3.5 h-3.5 text-[#235347]" />
              <span className="font-semibold">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-[#2a221b] dark:text-[#f5f0eb]">
                <Mail className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.document && (
              <div className="flex items-center gap-2 text-[#63574d] dark:text-[#c4b9ae] pt-1">
                <span className="text-[10px] font-semibold uppercase">Documento:</span>
                <span className="font-mono text-[11px]">{customer.document}</span>
              </div>
            )}
          </div>

          {/* Observações */}
          {customer.notes && (
            <div className="p-3.5 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c]">
              <span className="text-[10px] font-semibold uppercase text-[#8c7f74] dark:text-[#8a7f75] block mb-1">
                Anotações do Relacionamento
              </span>
              <p className="text-xs text-[#2a221b] dark:text-[#f5f0eb]">{customer.notes}</p>
            </div>
          )}

          {/* Resumo Comercial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#4a2e18]" />
              <span>Resumo de Compras e Fidelidade</span>
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block">Pedidos</span>
                <span className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  {customer.ordersCount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block">Vendas</span>
                <span className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  {customer.salesCount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] text-center">
                <span className="text-[10px] text-[#8c7f74] block">Total Comprado</span>
                <span className="text-xs font-bold text-[#235347] dark:text-emerald-400 block truncate mt-1">
                  {formatCurrency(customer.totalPurchasedAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Painel Financeiro e Inadimplência */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#235347]" />
              <span>Situação Financeira</span>
            </h4>
            <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#63574d] dark:text-[#c4b9ae]">Total Efetivamente Pago:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(customer.totalPaidAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
                <span className="text-[#63574d] dark:text-[#c4b9ae]">Saldo Pendente (A Receber):</span>
                <span className="font-bold text-base text-[#c29b38] dark:text-[#d4ac4a]">
                  {formatCurrency(customer.totalReceivableAmount)}
                </span>
              </div>

              {/* Alerta de Situação */}
              {customer.financial.totalReceivable > 0 ? (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2.5 ${
                    customer.financial.situation === 'inadimplente'
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                      : 'bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a] border border-amber-200 dark:border-amber-800/40'
                  }`}
                >
                  {customer.financial.situation === 'inadimplente' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">
                      {customer.financial.situation === 'inadimplente'
                        ? 'Possui títulos vencidos em atraso'
                        : `${customer.financial.receivableCount} título(s) em aberto dentro do prazo`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Nenhuma pendência financeira. Cliente em dia.</span>
                </div>
              )}
            </div>
          </div>

          {/* Histórico Recente de Pedidos e Vendas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#c29b38]" />
              <span>Histórico Recente de Movimentações</span>
            </h4>
            {customer.history.length > 0 ? (
              <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 overflow-hidden">
                {customer.history.map((ev) => (
                  <div key={ev.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#235347] dark:text-[#377d6c]">
                          {ev.code}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {ev.type === 'order' ? 'Pedido' : 'Venda'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8c7f74] mt-0.5">
                        {formatDate(ev.date)} • {ev.status}
                      </p>
                    </div>
                    <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                      {formatCurrency(ev.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-center text-[#8c7f74]">
                Sem histórico recente registrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
