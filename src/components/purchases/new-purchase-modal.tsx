'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  DollarSign,
  Building2,
  PlusCircle,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import {
  CreatePurchaseInput,
  PurchaseOrder,
  PurchaseItemType,
  Supplier,
} from '@/types/purchases';
import { purchaseService } from '@/services/purchase-service';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPurchase: PurchaseOrder) => void;
  onOpenNewSupplier: () => void;
  suppliers: Supplier[];
}

interface ItemDraft {
  name: string;
  type: PurchaseItemType;
  quantity: number;
  unit: string;
  unitCost: number;
}

export function NewPurchaseModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenNewSupplier,
  suppliers,
}: NewPurchaseModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [date, setDate] = useState<string>('08/09/2026');
  const [notes, setNotes] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [items, setItems] = useState<ItemDraft[]>([
    {
      name: 'Chocolate Nobre Meio Amargo 54%',
      type: 'material',
      quantity: 20,
      unit: 'kg',
      unitCost: 48.0,
    },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (suppliers.length > 0 && !selectedSupplierId) {
      setSelectedSupplierId(suppliers[0].id);
    }
    setDate('08/09/2026');
    setNotes('');
    setDiscount(0);
    setPaidAmount(0);
    setErrors({});
    setGeneralError(null);
  }, [isOpen, suppliers]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: '',
        type: 'material',
        quantity: 1,
        unit: 'kg',
        unitCost: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof ItemDraft,
    val: string | number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  // Cálculos financeiros
  const subtotal = items.reduce(
    (acc, curr) => acc + (curr.quantity || 0) * (curr.unitCost || 0),
    0
  );
  const safeDiscount = Math.max(0, discount || 0);
  const totalAmount = Math.max(0, subtotal - safeDiscount);
  const safePaidAmount = Math.max(0, Math.min(totalAmount, paidAmount || 0));
  const balanceDue = Math.max(0, totalAmount - safePaidAmount);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedSupplierId) errs.supplierId = 'Selecione um fornecedor.';
    if (items.length === 0) errs.items = 'Adicione ao menos um item.';

    items.forEach((it, idx) => {
      if (!it.name.trim()) errs[`item_${idx}_name`] = 'Nome obrigatório.';
      if (it.quantity <= 0) errs[`item_${idx}_qty`] = 'Qtd > 0.';
      if (it.unitCost < 0) errs[`item_${idx}_cost`] = 'Custo >= 0.';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    setGeneralError(null);
    if (!validate()) return;

    const supplier = suppliers.find((s) => s.id === selectedSupplierId);

    const input: CreatePurchaseInput = {
      supplierId: selectedSupplierId,
      supplierName: supplier?.name || 'Fornecedor Cadastrado',
      supplierDocument: supplier?.document,
      date,
      items: items.map((it) => ({
        name: it.name.trim(),
        type: it.type,
        quantity: it.quantity,
        unit: it.unit,
        unitCost: it.unitCost,
      })),
      discount: safeDiscount,
      paidAmount: safePaidAmount,
      notes: notes.trim() || undefined,
    };

    const res = purchaseService.create(input);
    if (!res.success || !res.purchase) {
      setGeneralError(res.error || 'Erro ao registrar compra.');
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

      <div className="relative w-full max-w-2xl bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Registrar Nova Compra
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Insumos, materiais de cozinha e embalagens
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

        {/* General Error Banner */}
        {generalError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Fornecedor e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Fornecedor <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenNewSupplier}
                  className="text-[10px] text-[#235347] dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Novo Fornecedor</span>
                </button>
              </div>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
              >
                <option value="">Selecione um fornecedor...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.document})
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="text-rose-600 text-[11px]">{errors.supplierId}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Data da Compra <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>
          </div>

          {/* Seção de Itens da Compra */}
          <div className="space-y-2 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[10px] text-[#8c7f74] dark:text-[#8a7f75]">
                Itens da Compra ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#235347] dark:text-emerald-400 font-bold flex items-center gap-1 hover:bg-stone-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-12 sm:col-span-4 space-y-0.5">
                    <input
                      type="text"
                      placeholder="Nome do item (ex: Chocolate 54%)"
                      value={it.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-xs font-semibold"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <select
                      value={it.type}
                      onChange={(e) => handleItemChange(idx, 'type', e.target.value as PurchaseItemType)}
                      className="w-full px-2 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[11px]"
                    >
                      <option value="material">Material</option>
                      <option value="packaging">Embalagem</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      placeholder="Qtd"
                      value={it.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          'quantity',
                          Math.max(0, parseFloat(e.target.value) || 0)
                        )
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-xs font-bold text-center"
                    />
                    <select
                      value={it.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="w-14 px-1 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[11px]"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="l">L</option>
                      <option value="un">un</option>
                      <option value="cento">cento</option>
                      <option value="caixa">cx</option>
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Custo un"
                      value={it.unitCost}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          'unitCost',
                          Math.max(0, parseFloat(e.target.value) || 0)
                        )
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-xs font-semibold text-right"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex items-center justify-between pl-1">
                    <span className="font-bold text-[#2a221b] dark:text-[#f5f0eb] whitespace-nowrap">
                      {formatCurrency(it.quantity * it.unitCost)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded-md text-stone-400 hover:text-rose-600"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fechamento Financeiro */}
          <div className="p-4 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75] block">
              Fechamento e Condição de Pagamento
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#8c7f74]">Subtotal Bruto</label>
                <div className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 font-bold text-sm text-[#2a221b] dark:text-[#f5f0eb]">
                  {formatCurrency(subtotal)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Desconto Comercial (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-transparent font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#235347] dark:text-emerald-400">
                  Valor Total da Compra
                </label>
                <div className="px-3 py-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] font-extrabold text-sm text-[#235347] dark:text-emerald-400">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>

            {/* Divisão Valor Pago vs Saldo a Pagar */}
            <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#235347] dark:text-emerald-400">
                  Valor Pago Imediato (À Vista ou Sinal)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  max={totalAmount}
                  value={paidAmount}
                  onChange={(e) =>
                    setPaidAmount(
                      Math.max(0, Math.min(totalAmount, parseFloat(e.target.value) || 0))
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 font-extrabold text-sm text-[#235347] dark:text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#c29b38] dark:text-[#d4ac4a]">
                  Saldo a Pagar (A Prazo / Boleto)
                </label>
                <div className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-[#faf5e8] dark:bg-[#2c2415] font-extrabold text-sm text-[#c29b38] dark:text-[#d4ac4a]">
                  {formatCurrency(balanceDue)}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observações da Compra
            </label>
            <input
              type="text"
              placeholder="Ex: NF-e emitida, faturado para 15 dias, entrega na doca 1..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>
        </div>

        {/* Footer Actions */}
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
            Registrar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
