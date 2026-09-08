'use client';

import React, { useState } from 'react';
import { X, Ban, AlertTriangle, AlertCircle } from 'lucide-react';
import { PurchaseOrder, CancelPurchaseInput } from '@/types/purchases';
import { purchaseService } from '@/services/purchase-service';

interface CancelPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cancelledPurchase: PurchaseOrder) => void;
  purchase: PurchaseOrder | null;
}

export function CancelPurchaseModal({
  isOpen,
  onClose,
  onSuccess,
  purchase,
}: CancelPurchaseModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !purchase) return null;

  const handleCancel = () => {
    if (!reason.trim()) {
      setError('Informe a justificativa/motivo do cancelamento da compra.');
      return;
    }

    const input: CancelPurchaseInput = {
      purchaseId: purchase.id,
      reason: reason.trim(),
    };

    const res = purchaseService.cancel(input);
    if (!res.success || !res.purchase) {
      setError(res.error || 'Erro ao cancelar compra.');
      return;
    }

    onSuccess(res.purchase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col">
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Cancelar Compra {purchase.purchaseNumber}
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                {purchase.supplierName} • Total R$ {purchase.totalAmount.toFixed(2)}
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

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Atenção: Ação Irreversível</span>
            </div>
            <p className="text-[11px]">
              O pedido de compra será marcado como <strong>Cancelado</strong>. O registro histórico será mantido para auditoria e o valor será estornado do total de compras ativas.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Motivo do Cancelamento <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Fornecedor sem disponibilidade de entrega, avaria de transporte, pedido duplicado..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-end gap-3 bg-[#f8f6f0] dark:bg-[#181614]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-xs transition-colors"
          >
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  );
}
