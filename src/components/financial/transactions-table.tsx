'use client';

import React from 'react';
import { FinancialTransaction } from '@/types/financial';
import { ArrowDownRight, ArrowUpRight, Eye } from 'lucide-react';

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  onSelectTransaction: (transaction: FinancialTransaction) => void;
}

const ORIGIN_LABELS: Record<string, string> = {
  venda: 'Venda',
  pagamento_cliente: 'Pagamento de Cliente',
  compra: 'Compra',
  pagamento_fornecedor: 'Pagamento de Fornecedor',
  despesa: 'Despesa Operacional',
  adiantamento: 'Adiantamento',
  ajuste: 'Ajuste',
  lancamento_direto: 'Lançamento Direto',
};

const PAYMENT_LABELS: Record<string, string> = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  boleto: 'Boleto Bancário',
  transferencia: 'Transferência / TED',
};

export function TransactionsTable({
  transactions,
  onSelectTransaction,
}: TransactionsTableProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c]">
        <p className="text-sm font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
          Nenhuma movimentação financeira encontrada
        </p>
        <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75] mt-1">
          Ajuste os termos de busca ou filtros selecionados.
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
              <th className="py-3.5 px-4 sm:px-6">Data</th>
              <th className="py-3.5 px-4">Descrição</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Categoria</th>
              <th className="py-3.5 px-4 text-center">Tipo</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell">Origem</th>
              <th className="py-3.5 px-4 text-center hidden sm:table-cell">Forma Pagto</th>
              <th className="py-3.5 px-4 text-right">Valor</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-xs">
            {transactions.map((tx) => {
              const isInflow = tx.type === 'entrada';

              return (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-[#f1ede4]/50 dark:hover:bg-[#2c2824]/40 transition-colors cursor-pointer group"
                >
                  {/* Data */}
                  <td className="py-4 px-4 sm:px-6 text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Descrição */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#2a221b] dark:text-[#f5f0eb] truncate max-w-[200px] sm:max-w-[260px]">
                      {tx.description}
                    </p>
                    {tx.referenceId && (
                      <p className="text-[10px] text-[#8c7f74] font-mono">
                        Ref: {tx.referenceId}
                      </p>
                    )}
                  </td>

                  {/* Categoria */}
                  <td className="py-4 px-4 text-[#63574d] dark:text-[#c4b9ae] hidden md:table-cell whitespace-nowrap">
                    {tx.category}
                  </td>

                  {/* Tipo (Entrada / Saída) */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isInflow
                          ? 'bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {isInflow ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      <span>{isInflow ? 'Entrada' : 'Saída'}</span>
                    </span>
                  </td>

                  {/* Origem */}
                  <td className="py-4 px-4 text-center hidden lg:table-cell whitespace-nowrap">
                    <span className="text-[11px] text-[#63574d] dark:text-[#c4b9ae] bg-stone-100 dark:bg-stone-800/60 px-2 py-0.5 rounded-md">
                      {ORIGIN_LABELS[tx.origin] || tx.origin}
                    </span>
                  </td>

                  {/* Forma de Pagamento */}
                  <td className="py-4 px-4 text-center text-[#63574d] dark:text-[#c4b9ae] hidden sm:table-cell whitespace-nowrap">
                    {PAYMENT_LABELS[tx.paymentMethod] || tx.paymentMethod}
                  </td>

                  {/* Valor */}
                  <td className="py-4 px-4 text-right font-extrabold whitespace-nowrap">
                    <span
                      className={
                        isInflow
                          ? 'text-[#235347] dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }
                    >
                      {isInflow ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e9f1ee] text-[#235347] dark:bg-[#192723] dark:text-[#377d6c]">
                      Confirmado
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(tx);
                      }}
                      className="p-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#235347] dark:hover:text-[#377d6c] transition-colors"
                      title="Ver detalhes da movimentação"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c7f74] dark:text-[#8a7f75]">
        <span>Mostrando {transactions.length} movimentações no período selecionado</span>
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
