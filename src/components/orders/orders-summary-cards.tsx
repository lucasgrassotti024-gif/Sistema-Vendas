'use client';

import React from 'react';
import { ShoppingBag, Clock, Flame, Truck } from 'lucide-react';
import { OrdersSummaryMetrics } from '@/types/orders';

interface OrdersSummaryCardsProps {
  metrics: OrdersSummaryMetrics;
}

export function OrdersSummaryCards({ metrics }: OrdersSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Pedidos Hoje */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Pedidos Hoje
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.ordersTodayCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Novas encomendas recebidas
        </p>
      </div>

      {/* Pedidos Pendentes */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Pedidos Pendentes
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {metrics.ordersPendingCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Aguardando sinal ou confirmação
        </p>
      </div>

      {/* Pedidos em Produção */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#4a2e18] dark:border-l-[#9e6d47] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Em Produção
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#4a2e18] dark:text-[#d4a373]">
              {metrics.ordersInProductionCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f6eee7] dark:bg-[#2a2018] text-[#4a2e18] dark:text-[#9e6d47]">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Fornadas em andamento na cozinha
        </p>
      </div>

      {/* Para Entregar */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Para Entregar
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              {metrics.ordersToDeliverCount} un
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <Truck className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Prontos ou agendados para hoje
        </p>
      </div>
    </div>
  );
}
