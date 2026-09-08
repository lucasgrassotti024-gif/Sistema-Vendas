'use client';

import React from 'react';
import { Users, UserPlus, ShoppingBag, Clock } from 'lucide-react';
import { CustomersSummaryMetrics } from '@/types/customers';

interface CustomersSummaryCardsProps {
  metrics: CustomersSummaryMetrics;
}

export function CustomersSummaryCards({ metrics }: CustomersSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Clientes */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#235347] dark:border-l-[#377d6c] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Total de Clientes
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              {metrics.totalCustomers}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Cadastrados na base da Veneza
        </p>
      </div>

      {/* Novos Clientes */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#2c4a6f] dark:border-l-[#446d9b] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Novos Clientes
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              {metrics.newCustomers}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Registrados nos últimos 30 dias
        </p>
      </div>

      {/* Clientes com Pedidos */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#4a2e18] dark:border-l-[#9e6d47] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Clientes Ativos
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#4a2e18] dark:text-[#d4a373]">
              {metrics.customersWithOrders}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#f6eee7] dark:bg-[#2a2018] text-[#4a2e18] dark:text-[#9e6d47]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Com pedidos ou vendas recentes
        </p>
      </div>

      {/* Com Valores a Receber */}
      <div className="p-5 rounded-2xl border border-l-4 border-l-[#c29b38] dark:border-l-[#d4ac4a] bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              Com Saldo a Receber
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#c29b38] dark:text-[#d4ac4a]">
              {metrics.customersWithReceivables}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
          Possuem títulos ou vendas a prazo
        </p>
      </div>
    </div>
  );
}
