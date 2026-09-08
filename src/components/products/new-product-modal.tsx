'use client';

import React, { useState, useEffect } from 'react';
import { X, PackagePlus, DollarSign, Layers, Tag, Wand2, Edit, AlertCircle } from 'lucide-react';
import { ProductData, calculateCommercialMetrics } from '@/types/products';
import { productService, CreateProductInput, UpdateProductInput } from '@/services/product-service';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: ProductData) => void;
  productToEdit?: ProductData | null;
}

export function NewProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
  const isEditing = !!productToEdit;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Brownies Tradicionais');
  const [unit, setUnit] = useState('un');
  const [salePrice, setSalePrice] = useState<number>(10);
  const [currentCost, setCurrentCost] = useState<number>(4);
  const [initialStock, setInitialStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(15);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCode(productToEdit.code);
      setDescription(productToEdit.description || '');
      setCategory(productToEdit.category);
      setUnit(productToEdit.unit);
      setSalePrice(productToEdit.salePrice);
      setCurrentCost(productToEdit.currentCost);
      setMinStock(productToEdit.minStock);
      setStatus(productToEdit.status);
      setNotes(productToEdit.notes || '');
      setInitialStock(productToEdit.currentStock);
    } else {
      setName('');
      setCode('');
      setDescription('');
      setCategory('Brownies Tradicionais');
      setUnit('un');
      setSalePrice(10);
      setCurrentCost(4);
      setInitialStock(0);
      setMinStock(15);
      setStatus('active');
      setNotes('');
    }
    setErrors({});
    setGeneralError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Usa regra comercial única
  const commercial = calculateCommercialMetrics(salePrice, currentCost);

  const handleGenerateSku = () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Preencha o nome do produto para gerar o SKU' }));
      return;
    }
    const suggested = productService.generateSkuSuggestion(name, category);
    setCode(suggested);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.code;
      return next;
    });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Nome do produto é obrigatório.';
    if (!code.trim()) errs.code = 'Código / SKU é obrigatório.';
    if (salePrice <= 0) errs.salePrice = 'Preço de venda deve ser maior que zero.';
    if (currentCost < 0) errs.currentCost = 'Custo não pode ser negativo.';
    if (!isEditing && initialStock < 0) errs.initialStock = 'Estoque inicial não pode ser negativo.';
    if (minStock < 0) errs.minStock = 'Estoque mínimo não pode ser negativo.';

    // Validação de SKU duplicado
    if (code.trim()) {
      const available = productService.isSkuAvailable(code.trim(), productToEdit?.id);
      if (!available) {
        errs.code = `O SKU "${code.trim().toUpperCase()}" já está em uso por outro produto.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    setGeneralError(null);
    if (!validate()) return;

    if (isEditing && productToEdit) {
      const updateData: UpdateProductInput = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        category,
        unit,
        salePrice,
        currentCost,
        minStock,
        status,
        notes: notes.trim(),
      };
      const res = productService.update(productToEdit.id, updateData);
      if (!res.success || !res.product) {
        setGeneralError(res.error || 'Erro ao salvar alterações no produto.');
        return;
      }
      onSuccess(res.product);
      onClose();
    } else {
      const createData: CreateProductInput = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        category,
        unit,
        salePrice,
        currentCost,
        initialStock: Math.max(0, initialStock || 0),
        minStock: Math.max(0, minStock || 0),
        status,
        notes: notes.trim(),
      };
      const res = productService.create(createData);
      if (!res.success || !res.product) {
        setGeneralError(res.error || 'Erro ao cadastrar produto.');
        return;
      }
      onSuccess(res.product);
      onClose();
    }
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
            <div
              className={`p-2 rounded-xl ${
                isEditing
                  ? 'bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#6ba1d6]'
                  : 'bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]'
              }`}
            >
              {isEditing ? <Edit className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                {isEditing ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                {isEditing
                  ? 'Atualize os dados comerciais e de catálogo do produto'
                  : 'Cadastre itens no catálogo de venda da Veneza'}
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
              {errors.name && <p className="text-rose-600 text-[11px]">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  Código / SKU <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[10px] text-[#235347] dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
                  title="Sugerir SKU a partir do nome"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Sugerir</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="BRW-NINHO"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] font-mono uppercase focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
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
                <option value="Geral">Geral</option>
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

          {/* Precificação Comercial: Preço de Venda, Custo e Margem Centralizada */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8c7f74] dark:text-[#8a7f75] block">
              Composição Financeira
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#235347] dark:text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Preço de Venda (R$) *</span>
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
                  Custo Atual (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.10"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] font-bold text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                />
                {errors.currentCost && <p className="text-rose-600 text-[11px]">{errors.currentCost}</p>}
              </div>
            </div>

            {/* Margem Bruta Pré-visualizada */}
            <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex items-center justify-between">
              <span className="text-[#8c7f74] dark:text-[#8a7f75]">Margem e Lucro Unitário:</span>
              <strong className="text-[#2c4a6f] dark:text-[#6ba1d6] text-sm">
                {commercial.marginPercent}% (R$ {commercial.unitProfit.toFixed(2)} por {unit})
              </strong>
            </div>
          </div>

          {/* Estoque e Situação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {!isEditing ? (
              <div className="space-y-1">
                <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#235347]" />
                  <span>Estoque Inicial</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialStock}
                  onChange={(e) => setInitialStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-bold"
                />
                {errors.initialStock && <p className="text-rose-600 text-[11px]">{errors.initialStock}</p>}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-[#8c7f74] dark:text-[#8a7f75]">
                  Estoque Atual
                </label>
                <div className="px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-stone-100 dark:bg-stone-900 font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                  {productToEdit.currentStock} {unit}
                </div>
                <p className="text-[10px] text-[#8c7f74]">Estoque físico é gerenciado via ledger</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c29b38]" />
                <span>Estoque Mínimo</span>
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
              {errors.minStock && <p className="text-rose-600 text-[11px]">{errors.minStock}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Situação
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

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#8c7f74] dark:text-[#8a7f75]">
              Observações Internas (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Embalagem sazonal, lote especial..."
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
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
}
