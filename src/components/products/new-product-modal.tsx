'use client';

import React, { useState } from 'react';
import { X, PackagePlus, DollarSign, Layers, Tag } from 'lucide-react';
import { ProductData } from '@/types/products';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newProduct: ProductData) => void;
}

export function NewProductModal({ isOpen, onClose, onCreated }: NewProductModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Brownies Tradicionais');
  const [unit, setUnit] = useState('un');
  const [salePrice, setSalePrice] = useState<number>(10);
  const [currentCost, setCurrentCost] = useState<number>(4);
  const [minStock, setMinStock] = useState<number>(15);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [errors, setErrors] = useState<{ name?: string; code?: string; salePrice?: string }>({});

  if (!isOpen) return null;

  const marginPercent =
    salePrice > 0 ? ((salePrice - currentCost) / salePrice) * 100 : 0;

  const validate = () => {
    const errs: { name?: string; code?: string; salePrice?: string } = {};
    if (!name.trim()) errs.name = 'Nome do produto é obrigatório.';
    if (!code.trim()) errs.code = 'Código/SKU é obrigatório.';
    if (salePrice <= 0) errs.salePrice = 'Preço de venda deve ser maior que zero.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newProd: ProductData = {
      id: `prod-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      category,
      unit,
      salePrice,
      currentCost,
      marginPercent: Math.max(0, marginPercent),
      currentStock: 0, // Inicia zerado até primeira produção/entrada
      minStock,
      status,
      history: [],
      priceHistory: [],
    };

    onCreated(newProd);
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
      <div className="relative w-full max-w-xl bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Novo Produto
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Cadastre itens no catálogo de venda da Veneza
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Nome e SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Nome do Produto <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Brownie Ninho com Nutella"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
              {errors.name && <p className="text-rose-600 text-[11px]">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Código / SKU <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="BRW-NINHO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-mono focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
              {errors.code && <p className="text-rose-600 text-[11px]">{errors.code}</p>}
            </div>
          </div>

          {/* Categoria e Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span>Categoria</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              >
                <option value="Brownies Tradicionais">Brownies Tradicionais</option>
                <option value="Brownies Especiais">Brownies Especiais</option>
                <option value="Kits & Caixas">Kits & Caixas</option>
                <option value="Encomendas & Festas">Encomendas & Festas</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Unidade de Medida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              >
                <option value="un">Unidade (un)</option>
                <option value="caixa">Caixa</option>
                <option value="cento">Cento</option>
                <option value="pacote">Pacote</option>
              </select>
            </div>
          </div>

          {/* Precificação Comercial: Preço de Venda, Custo Manual e Margem Calculada */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8c7f74] dark:text-[#8a7f75] block">
              Composição Financeira (V1)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#235347] dark:text-emerald-400">
                  Preço de Venda (R$) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.50"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] font-bold text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                />
                {errors.salePrice && <p className="text-rose-600 text-[11px]">{errors.salePrice}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4a2e18] dark:text-[#d4a373]">
                  Custo Manual Estimado (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.10"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] font-bold text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                />
              </div>
            </div>

            {/* Margem Bruta Pré-visualizada */}
            <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex items-center justify-between">
              <span className="text-[#8c7f74] dark:text-[#8a7f75]">Margem Bruta Resultante:</span>
              <strong className="text-[#2c4a6f] dark:text-[#6ba1d6] text-sm">
                {marginPercent.toFixed(1)}% (R$ {(salePrice - currentCost).toFixed(2)} por {unit})
              </strong>
            </div>
          </div>

          {/* Estoque Mínimo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c29b38]" />
                <span>Estoque Mínimo de Alerta</span>
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Situação do Catálogo
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Descrição do Produto
            </label>
            <textarea
              rows={2}
              placeholder="Descreva os ingredientes de destaque, cobertura ou proposta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            Cadastrar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
