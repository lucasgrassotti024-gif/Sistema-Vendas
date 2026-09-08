'use client';

import React, { useState } from 'react';
import { X, DollarSign, ArrowDownRight, ArrowUpRight, AlertCircle } from 'lucide-react';
import {
  CreateDirectTransactionInput,
  FinancialTransaction,
  FinancialTransactionType,
  PaymentMethod,
} from '@/types/financial';
import { financialService } from '@/services/financial-service';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTx: FinancialTransaction) => void;
}

export function NewTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: NewTransactionModalProps) {
  const [type, setType] = useState<FinancialTransactionType>('saida');
  const [category, setCategory] = useState<string>('Despesa Operacional');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>('08/09/2026');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError(null);
    if (!description.trim()) {
      setError('A descrição do lançamento é obrigatória.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    const input: CreateDirectTransactionInput = {
      type,
      category,
      description: description.trim(),
      amount,
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    };

    const res = financialService.createDirectTransaction(input);
    if (!res.success || !res.transaction) {
      setError(res.error || 'Erro ao registrar lançamento.');
      return;
    }

    onSuccess(res.transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Novo Lançamento Financeiro
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Lançamento direto avulso no caixa/banco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7f74] hover:text-[#2a221b] dark:hover:text-[#f5f0eb]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Seletor Tipo: Entrada / Saída */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('entrada')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === 'entrada'
                  ? 'border-emerald-500 bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] ring-2 ring-emerald-500/30'
                  : 'border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#63574d] dark:text-[#c4b9ae]'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Entrada (Receita)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('saida')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === 'saida'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30'
                  : 'border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#63574d] dark:text-[#c4b9ae]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Saída (Despesa)</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
            Lançamentos diretos registram despesas ou receitas gerais da empresa, sem vincular a vendas ou compras de catálogo.
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Descrição do Lançamento <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Pagamento internet fibra, taxa bancária, manutenção..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Valor (R$) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] font-bold text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Data
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>
          </div>

          {/* Categoria e Forma de Pagamento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
              >
                <option value="Despesa Operacional">Despesa Operacional</option>
                <option value="Custos de Energia & Gás">Custos de Energia & Gás</option>
                <option value="Manutenção & Cozinha">Manutenção & Cozinha</option>
                <option value="Taxas & Serviços Bancários">Taxas & Bancos</option>
                <option value="Marketing & Anúncios">Marketing & Anúncios</option>
                <option value="Outras Receitas">Outras Receitas</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
              >
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="boleto">Boleto</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observação Adicional
            </label>
            <input
              type="text"
              placeholder="Ex: Comprovante pago no Santander..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-end gap-3 bg-[#f8f6f0] dark:bg-[#181614]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            Confirmar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
}
