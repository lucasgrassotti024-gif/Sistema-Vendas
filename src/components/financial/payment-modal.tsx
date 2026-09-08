'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, AlertCircle, AlertTriangle } from 'lucide-react';
import {
  TitleReceivable,
  TitlePayable,
  PaymentMethod,
  RegisterPaymentInput,
} from '@/types/financial';
import { financialService } from '@/services/financial-service';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  titleItem: TitleReceivable | TitlePayable | null;
  titleType: 'receivable' | 'payable';
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  titleItem,
  titleType,
}: PaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>('08/09/2026');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (titleItem) {
      setPaymentAmount(titleItem.balanceDue);
      setPaymentDate('08/09/2026');
      setPaymentMethod('pix');
      setNotes('');
      setError(null);
    }
  }, [titleItem, isOpen]);

  if (!isOpen || !titleItem) return null;

  const isReceivable = titleType === 'receivable';
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalTitle = titleItem.originalAmount;
  const alreadyPaid = isReceivable
    ? (titleItem as TitleReceivable).receivedAmount
    : (titleItem as TitlePayable).paidAmount;
  const currentBalance = titleItem.balanceDue;
  const projectedBalance = Math.max(0, currentBalance - (paymentAmount || 0));

  const handleConfirm = () => {
    setError(null);
    if (!paymentAmount || paymentAmount <= 0) {
      setError('O valor do pagamento deve ser maior que zero.');
      return;
    }
    if (paymentAmount > currentBalance) {
      setError(
        `O valor não pode ser superior ao saldo devedor (${formatCurrency(
          currentBalance
        )}).`
      );
      return;
    }

    const input: RegisterPaymentInput = {
      titleType,
      titleId: titleItem.id,
      paymentAmount,
      paymentDate,
      paymentMethod,
      notes: notes.trim() || undefined,
    };

    const res = financialService.registerPayment(input);
    if (!res.success) {
      setError(res.error || 'Erro ao processar pagamento.');
      return;
    }

    onSuccess();
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
            <div
              className={`p-2 rounded-xl ${
                isReceivable
                  ? 'bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                {isReceivable ? 'Receber Título' : 'Pagar Título'}
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                {isReceivable
                  ? (titleItem as TitleReceivable).clientName
                  : (titleItem as TitlePayable).supplierName}
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
          {/* Box de Confronto de Valores */}
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-2">
            <div className="flex justify-between text-[#8c7f74]">
              <span>Valor Total do Título:</span>
              <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                {formatCurrency(totalTitle)}
              </strong>
            </div>
            <div className="flex justify-between text-[#8c7f74]">
              <span>Valor Já Liquidado:</span>
              <span className="font-semibold text-stone-600 dark:text-stone-300">
                {formatCurrency(alreadyPaid)}
              </span>
            </div>
            <div className="flex justify-between text-[#c29b38] dark:text-[#d4ac4a] font-bold pt-1 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
              <span>Saldo Devedor Atual:</span>
              <span>{formatCurrency(currentBalance)}</span>
            </div>
          </div>

          {/* Valor a pagar */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Valor Deste Pagamento (R$) <span className="text-rose-600">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              max={currentBalance}
              value={paymentAmount}
              onChange={(e) =>
                setPaymentAmount(
                  Math.max(0, parseFloat(e.target.value) || 0)
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-base font-extrabold text-[#235347] dark:text-emerald-400 outline-hidden"
            />
            <p className="text-[10px] text-[#8c7f74]">
              Permite pagamento parcial. Saldo após baixa: <strong>{formatCurrency(projectedBalance)}</strong>
            </p>
          </div>

          {/* Data e Forma de Pagamento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Data da Baixa
              </label>
              <input
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Forma de Pagto
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
              >
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="transferencia">Transferência</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observação / Comprovante
            </label>
            <input
              type="text"
              placeholder="Ex: Pago via app Nubank, comprovante anexado..."
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
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-xl text-white font-bold shadow-xs transition-colors ${
              isReceivable
                ? 'bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c]'
                : 'bg-rose-700 hover:bg-rose-800'
            }`}
          >
            Confirmar Liquidação
          </button>
        </div>
      </div>
    </div>
  );
}
