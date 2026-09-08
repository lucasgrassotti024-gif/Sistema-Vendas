'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, AlertCircle, Layers } from 'lucide-react';
import { CreateProductionInput, ProductionOrder } from '@/types/production';
import { productionService } from '@/services/production-service';
import { productService } from '@/services/product-service';

interface NewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOrder: ProductionOrder) => void;
}

export function NewProductionModal({
  isOpen,
  onClose,
  onSuccess,
}: NewProductionModalProps) {
  const [productsList, setProductsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [plannedQuantity, setPlannedQuantity] = useState<number>(50);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [responsibleName, setResponsibleName] = useState<string>('Lucas Grassotti');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    // Carrega produtos disponíveis no catálogo existente
    const prods = productService.getAll().filter((p) => p.status === 'active');
    setProductsList(prods.map((p) => ({ id: p.id, name: p.name })));
    if (prods.length > 0 && !selectedProductId) {
      setSelectedProductId(prods[0].id);
    }

    const todayFormatted = '08/09/2026';
    setScheduledDate(todayFormatted);
    setPlannedQuantity(50);
    setResponsibleName('Lucas Grassotti');
    setNotes('');
    setErrors({});
    setGeneralError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = productsList.find((p) => p.id === selectedProductId);

  // Prévia mockada de materiais necessários
  const multiplier = (plannedQuantity || 0) / 100;
  const mockPreviewMaterials = [
    { name: 'Chocolate Nobre Meio Amargo 54%', qty: (1.5 * multiplier).toFixed(2), unit: 'kg' },
    { name: 'Farinha de Trigo Especial', qty: (1.2 * multiplier).toFixed(2), unit: 'kg' },
    { name: 'Manteiga Extra Sem Sal', qty: (0.9 * multiplier).toFixed(2), unit: 'kg' },
    { name: 'Açúcar Cristal Nobre', qty: (0.9 * multiplier).toFixed(2), unit: 'kg' },
  ];

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedProductId) errs.productId = 'Selecione o produto a ser produzido.';
    if (!plannedQuantity || plannedQuantity <= 0) {
      errs.plannedQuantity = 'A quantidade planejada deve ser maior que zero.';
    }
    if (!scheduledDate.trim()) {
      errs.scheduledDate = 'Informe a data programada para a produção.';
    }
    if (!responsibleName.trim()) {
      errs.responsibleName = 'Informe o responsável pela ordem de produção.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    setGeneralError(null);
    if (!validate()) return;

    const input: CreateProductionInput = {
      productId: selectedProductId,
      productName: selectedProduct?.name || 'Brownie Artesanal',
      plannedQuantity,
      scheduledDate: scheduledDate.trim(),
      responsibleName: responsibleName.trim(),
      notes: notes.trim() || undefined,
    };

    const res = productionService.create(input);
    if (!res.success || !res.order) {
      setGeneralError(res.error || 'Erro ao criar ordem de produção.');
      return;
    }

    onSuccess(res.order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#faf5e8] dark:bg-[#2c2415] text-[#c29b38] dark:text-[#d4ac4a]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Nova Ordem de Produção
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Planeje uma fornada de brownies no forno
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Produto Selector */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Produto a Produzir <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-medium"
            >
              <option value="">Selecione um produto...</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-rose-600 text-[11px]">{errors.productId}</p>}
          </div>

          {/* Quantidade Planejada e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Quantidade Planejada (un) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={plannedQuantity}
                onChange={(e) => setPlannedQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-bold outline-hidden"
              />
              {errors.plannedQuantity && (
                <p className="text-rose-600 text-[11px]">{errors.plannedQuantity}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Data Programada <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: 08/09/2026"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
              {errors.scheduledDate && (
                <p className="text-rose-600 text-[11px]">{errors.scheduledDate}</p>
              )}
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Responsável pela Fornada <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Nome do confeiteiro ou responsável"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
            {errors.responsibleName && (
              <p className="text-rose-600 text-[11px]">{errors.responsibleName}</p>
            )}
          </div>

          {/* Prévia Mockada de Insumos da Receita */}
          <div className="p-3.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span>Estimativa de Insumos (Receita Padrão)</span>
              </span>
              <span className="text-[10px] text-[#8c7f74]">Para {plannedQuantity} un</span>
            </div>
            <div className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60 text-[11px]">
              {mockPreviewMaterials.map((mat, i) => (
                <div key={i} className="py-1.5 flex justify-between">
                  <span className="text-[#2a221b] dark:text-[#f5f0eb]">{mat.name}</span>
                  <span className="font-semibold text-[#235347] dark:text-emerald-400">
                    {mat.qty} {mat.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observações Operacionais
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Fornada especial para eventos, tempo extra de descanso na geladeira..."
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
            className="px-4 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] text-[#63574d] dark:text-[#c4b9ae] font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            Criar Ordem
          </button>
        </div>
      </div>
    </div>
  );
}
