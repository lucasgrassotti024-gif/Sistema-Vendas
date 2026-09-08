'use client';

import React, { useState } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';
import { Supplier, CreateSupplierInput } from '@/types/purchases';
import { purchaseService } from '@/services/purchase-service';

interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSupplier: Supplier) => void;
}

export function NewSupplierModal({
  isOpen,
  onClose,
  onSuccess,
}: NewSupplierModalProps) {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('O nome da empresa ou fornecedor é obrigatório.');
      return;
    }

    const input: CreateSupplierInput = {
      name: name.trim(),
      document: document.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    };

    const res = purchaseService.createSupplier(input);
    if (!res.success || !res.supplier) {
      setError(res.error || 'Erro ao cadastrar fornecedor.');
      return;
    }

    onSuccess(res.supplier);
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
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Cadastrar Fornecedor
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Adicione um novo parceiro comercial
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

        <div className="p-6 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Razão Social / Nome Fantasia <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Fornecedor de Chocolates Brasil Ltda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                CNPJ / CPF
              </label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              E-mail Comercial
            </label>
            <input
              type="email"
              placeholder="pedidos@fornecedor.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observações
            </label>
            <input
              type="text"
              placeholder="Ex: Prazo de entrega de 3 dias, pedido mínimo R$ 500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold shadow-xs transition-colors"
          >
            Cadastrar Fornecedor
          </button>
        </div>
      </div>
    </div>
  );
}
