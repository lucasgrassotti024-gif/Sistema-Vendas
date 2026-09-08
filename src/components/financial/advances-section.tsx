'use client';

import React from 'react';
import { CustomerAdvance } from '@/types/financial';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface AdvancesSectionProps {
  advances: CustomerAdvance[];
}

export function AdvancesSection({ advances }: AdvancesSectionProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getStatusBadge = (status: CustomerAdvance['status']) => {
    switch (status) {
      case 'disponivel':
        return {
          label: 'Disponível',
          style: 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c] border border-emerald-300/40',
        };
      case 'utilizado_parcial':
        return {
          label: 'Parcialmente Aplicado',
          style: 'bg-[#edf3f9] text-[#2c4a6f] dark:bg-[#1a2430] dark:text-[#6ba1d6] border border-blue-300/40',
        };
      case 'utilizado_total':
        return {
          label: 'Totalmente Aplicado',
          style: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300/40',
        };
    }
  };

  const totalAvailable = advances.reduce((acc, curr) => acc + curr.availableBalance, 0);

  return (
    <div className="space-y-4">
      {/* Banner Informativo sobre Adiantamentos */}
      <div className="p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#2c4a6f] dark:text-[#6ba1d6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#2c4a6f] dark:text-[#6ba1d6]">
              Custódia de Adiantamentos de Clientes
            </h4>
            <p className="text-[11px] text-[#63574d] dark:text-[#c4b9ae]">
              Valores pagos antecipadamente por clientes como sinal de encomendas. Não são tratados como receita a receber.
            </p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1e1b18] border border-blue-200/60 dark:border-blue-900/40 text-right whitespace-nowrap">
          <span className="text-[10px] text-[#8c7f74] block uppercase font-medium">
            Saldo Disponível em Custódia
          </span>
          <strong className="text-sm font-extrabold text-[#235347] dark:text-emerald-400">
            {formatCurrency(totalAvailable)}
          </strong>
        </div>
      </div>

      {/* Tabela de Adiantamentos */}
      <div className="rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[11px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
                <th className="py-3.5 px-4 sm:px-6">Cliente</th>
                <th className="py-3.5 px-4 text-center">Data Recebimento</th>
                <th className="py-3.5 px-4 text-right">Valor Recebido</th>
                <th className="py-3.5 px-4 text-right">Valor Aplicado</th>
                <th className="py-3.5 px-4 text-right">Saldo Disponível</th>
                <th className="py-3.5 px-4 text-center">Situação</th>
                <th className="py-3.5 px-4 sm:px-6">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
              {advances.map((adv) => {
                const badge = getStatusBadge(adv.status);

                return (
                  <tr key={adv.id} className="hover:bg-[#f1ede4]/40 dark:hover:bg-[#2c2824]/40">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                      {adv.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                      {adv.date}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(adv.receivedAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                      {formatCurrency(adv.appliedAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold whitespace-nowrap">
                      <span
                        className={
                          adv.availableBalance > 0
                            ? 'text-[#235347] dark:text-emerald-400'
                            : 'text-[#8c7f74]'
                        }
                      >
                        {formatCurrency(adv.availableBalance)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[11px] text-[#8c7f74]">
                      {adv.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
