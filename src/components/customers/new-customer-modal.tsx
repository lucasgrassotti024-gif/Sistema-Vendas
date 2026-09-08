'use client';

import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { CustomerData } from '@/types/customers';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCustomer: CustomerData) => void;
}

export function NewCustomerModal({ isOpen, onClose, onCreated }: NewCustomerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = 'Nome é obrigatório.';
    if (!phone.trim()) errs.phone = 'Telefone é obrigatório.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newCust: CustomerData = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      document: document.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      status,
      ordersCount: 0,
      salesCount: 0,
      totalPurchasedAmount: 0,
      totalPaidAmount: 0,
      totalReceivableAmount: 0,
      financial: {
        receivableCount: 0,
        totalReceivable: 0,
        overdueCount: 0,
        situation: 'em_dia',
      },
      history: [],
    };

    onCreated(newCust);
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Novo Cliente
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Cadastre informações de contato e faturamento
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
          {/* Nome */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Nome Completo / Razão Social <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: João da Silva ou Empório Gourmet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
            />
            {errors.name && <p className="text-rose-600 text-[11px]">{errors.name}</p>}
          </div>

          {/* Telefone e Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#235347]" />
                <span>Telefone / WhatsApp <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
              {errors.phone && <p className="text-rose-600 text-[11px]">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span>CPF / CNPJ (Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>
          </div>

          {/* E-mail e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c29b38]" />
                <span>E-mail</span>
              </label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Situação do Cadastro
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

          {/* Observações */}
          <div className="space-y-1">
            <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
              Observações & Preferências
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Entrega preferencial pela manhã, restrições alimentares, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
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
            Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
