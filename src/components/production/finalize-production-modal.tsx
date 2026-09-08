'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { FinalizeProductionInput, ProductionOrder } from '@/types/production';
import { productionService } from '@/services/production-service';

interface FinalizeProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: ProductionOrder) => void;
  order: ProductionOrder | null;
}

export function FinalizeProductionModal({
  isOpen,
  onClose,
  onSuccess,
  order,
}: FinalizeProductionModalProps) {
  const [producedQuantity, setProducedQuantity] = useState<number>(0);
  const [lostQuantity, setLostQuantity] = useState<number>(0);
  const [lossReason, setLossReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [confirmStep, setConfirmStep] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setProducedQuantity(order.plannedQuantity);
      setLostQuantity(0);
      setLossReason('');
      setNotes('');
      setConfirmStep(false);
      setErrors({});
      setGeneralError(null);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (producedQuantity < 0) errs.producedQuantity = 'Quantidade produzida não pode ser negativa.';
    if (lostQuantity < 0) errs.lostQuantity = 'Quantidade perdida não pode ser negativa.';
    if (lostQuantity > 0 && !lossReason.trim()) {
      errs.lossReason = 'Informe o motivo do descarte/perda de unidades.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToConfirm = () => {
    if (validate()) {
      setConfirmStep(true);
    }
  };

  const handleFinalize = () => {
    setGeneralError(null);
    const input: FinalizeProductionInput = {
      orderId: order.id,
      producedQuantity,
      lostQuantity,
      lossReason: lossReason.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const res = productionService.finalize(input);
    if (!res.success || !res.order) {
      setGeneralError(res.error || 'Erro ao finalizar ordem de produção.');
      return;
    }

    onSuccess(res.order);
    onClose();
  };

  const totalProcessed = (producedQuantity || 0) + (lostQuantity || 0);
  const yieldPercent =
    totalProcessed > 0
      ? (((producedQuantity || 0) / totalProcessed) * 100).toFixed(1)
      : '100.0';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Finalizar Produção ({order.orderNumber})
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                {order.productName} • Planejado: {order.plannedQuantity} un
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {!confirmStep ? (
            <>
              {/* Quantidades Produzidas e Perdidas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#235347] dark:text-emerald-400">
                    Unidades Boas Produzidas <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={producedQuantity}
                    onChange={(e) => setProducedQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-bold outline-hidden"
                  />
                  {errors.producedQuantity && (
                    <p className="text-rose-600 text-[11px]">{errors.producedQuantity}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-rose-700 dark:text-rose-400">
                    Unidades Perdidas / Avaria
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lostQuantity}
                    onChange={(e) => setLostQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-bold outline-hidden"
                  />
                  {errors.lostQuantity && (
                    <p className="text-rose-600 text-[11px]">{errors.lostQuantity}</p>
                  )}
                </div>
              </div>

              {/* Prévia de Rendimento */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between">
                <span className="text-[#8c7f74]">Rendimento calculado:</span>
                <strong className="text-sm font-bold text-[#235347] dark:text-emerald-400">
                  {yieldPercent}% de aproveitamento
                </strong>
              </div>

              {/* Motivo de perda (se houver perdas) */}
              {lostQuantity > 0 && (
                <div className="space-y-1">
                  <label className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Motivo da Perda / Descarte *</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Queimou na borda, quebrou no corte, massa crua no meio..."
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                  />
                  {errors.lossReason && (
                    <p className="text-rose-600 text-[11px]">{errors.lossReason}</p>
                  )}
                </div>
              )}

              {/* Observação Geral */}
              <div className="space-y-1">
                <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Observações de Fechamento da Fornada
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Lote finalizado perfeitamente, pronto para embalagem..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                />
              </div>
            </>
          ) : (
            /* Passo de Confirmação */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Confirmação de Apontamento</span>
                </div>
                <p className="text-xs">
                  Você está finalizando a ordem <strong>{order.orderNumber}</strong> com:
                </p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li><strong>{producedQuantity}</strong> unidades boas</li>
                  <li><strong>{lostQuantity}</strong> unidades perdidas</li>
                  <li>Rendimento de <strong>{yieldPercent}%</strong></li>
                </ul>
              </div>
              <p className="text-[11px] text-[#8c7f74]">
                Nota: Esta etapa registra o processo operacional da produção. A integração automática de baixa de insumos e entrada em estoque de produtos acabados será vinculada nas próximas fases.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-end gap-3 bg-[#f8f6f0] dark:bg-[#181614]">
          {!confirmStep ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProceedToConfirm}
                className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
              >
                Avançar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirmStep(false)}
                className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              >
                Voltar e Ajustar
              </button>
              <button
                type="button"
                onClick={handleFinalize}
                className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
              >
                Confirmar Conclusão
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
