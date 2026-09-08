'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, Sliders, AlertOctagon, Layers, AlertCircle } from 'lucide-react';
import { InventoryItem, NewMovementInput } from '@/types/inventory';
import { inventoryService } from '@/services/inventory-service';

interface NewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedItem: InventoryItem) => void;
  preselectedItem?: InventoryItem | null;
  itemsList: InventoryItem[];
}

export function NewMovementModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedItem,
  itemsList,
}: NewMovementModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [movementType, setMovementType] = useState<'entrada' | 'ajuste' | 'perda'>('entrada');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedItem) {
      setSelectedItemId(preselectedItem.id);
    } else if (itemsList.length > 0 && !selectedItemId) {
      setSelectedItemId(itemsList[0].id);
    }
    setQuantity(1);
    setReason('');
    setReference('');
    setErrors({});
    setGeneralError(null);
  }, [preselectedItem, isOpen, itemsList]);

  if (!isOpen) return null;

  const currentItem = itemsList.find((i) => i.id === selectedItemId);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedItemId) errs.itemId = 'Selecione um item para movimentar.';
    if (!quantity || quantity <= 0) errs.quantity = 'A quantidade deve ser maior que zero.';
    if (!reason.trim()) errs.reason = 'Informe o motivo ou justificativa da movimentação.';

    if (movementType === 'perda' && currentItem && currentItem.currentStock < quantity) {
      errs.quantity = `Saldo insuficiente (${currentItem.currentStock} ${currentItem.unit}) para registrar baixa de perda.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    setGeneralError(null);
    if (!validate()) return;

    const input: NewMovementInput = {
      itemId: selectedItemId,
      type: movementType,
      quantity,
      reason: reason.trim(),
      reference: reference.trim() || undefined,
    };

    const res = inventoryService.createMovement(input);
    if (!res.success || !res.item) {
      setGeneralError(res.error || 'Erro ao processar movimentação de estoque.');
      return;
    }

    onSuccess(res.item);
    onClose();
  };

  // Simulação do saldo resultante
  const projectedBalance = () => {
    if (!currentItem) return 0;
    if (movementType === 'entrada') return currentItem.currentStock + (quantity || 0);
    if (movementType === 'perda') return Math.max(0, currentItem.currentStock - (quantity || 0));
    if (movementType === 'ajuste') return quantity || 0;
    return currentItem.currentStock;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Nova Movimentação de Estoque
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Registre entradas, correções de inventário ou perdas
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

        {/* Error Alert */}
        {generalError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Item Selector */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Selecione o Item <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
            >
              <option value="">Selecione um item...</option>
              {itemsList.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.type === 'product' ? 'PRODUTO' : item.type === 'material' ? 'MATERIAL' : 'EMBALAGEM'}] {item.name} ({item.currentStock} {item.unit})
                </option>
              ))}
            </select>
            {errors.itemId && <p className="text-rose-600 text-[11px]">{errors.itemId}</p>}
          </div>

          {/* Tipo de Movimentação Visual Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Tipo de Movimentação <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('entrada')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  movementType === 'entrada'
                    ? 'border-emerald-500 bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] ring-2 ring-emerald-500/30'
                    : 'border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#63574d] dark:text-[#c4b9ae]'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('ajuste')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  movementType === 'ajuste'
                    ? 'border-amber-500 bg-[#faf5e8] dark:bg-[#2c2415] text-[#916b15] dark:text-[#d4ac4a] ring-2 ring-amber-500/30'
                    : 'border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#63574d] dark:text-[#c4b9ae]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Ajuste</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('perda')}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  movementType === 'perda'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30'
                    : 'border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#63574d] dark:text-[#c4b9ae]'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Perda</span>
              </button>
            </div>
          </div>

          {/* Quantidade e Saldo Projetado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                {movementType === 'ajuste' ? 'Novo Saldo Contado' : 'Quantidade Movimentada'}{' '}
                <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-bold outline-hidden"
                />
                {currentItem && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#8c7f74] font-medium">
                    {currentItem.unit}
                  </span>
                )}
              </div>
              {errors.quantity && <p className="text-rose-600 text-[11px]">{errors.quantity}</p>}
            </div>

            {/* Simulação do Saldo */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] flex flex-col justify-center">
              <span className="text-[10px] text-[#8c7f74] uppercase font-bold">Saldo Resultante</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-extrabold text-[#235347] dark:text-emerald-400">
                  {projectedBalance()} {currentItem?.unit}
                </span>
                <span className="text-[10px] text-[#8c7f74]">
                  (Atual: {currentItem?.currentStock || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Motivo da Movimentação */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Motivo / Justificativa <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={2}
              placeholder={
                movementType === 'entrada'
                  ? 'Ex: Recebimento de compra, devolução de lote...'
                  : movementType === 'perda'
                  ? 'Ex: Embalagem danificada por umidade, produto vencido...'
                  : 'Ex: Inventário quinzenal de contagem física...'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
            {errors.reason && <p className="text-rose-600 text-[11px]">{errors.reason}</p>}
          </div>

          {/* Referência / Documento */}
          <div className="space-y-1">
            <label className="font-bold text-[#8c7f74] dark:text-[#8a7f75]">
              Documento de Referência (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: NF-8902, PED-445, AVARIA-12..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-mono outline-hidden"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-end gap-3 bg-[#f8f6f0] dark:bg-[#181614]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            Confirmar Movimentação
          </button>
        </div>
      </div>
    </div>
  );
}
