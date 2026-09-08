'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, User, ShoppingBag, DollarSign } from 'lucide-react';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, ProductOption } from '@/types/sales';
import { OrderData } from '@/types/orders';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newOrder: OrderData) => void;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export function NewOrderModal({ isOpen, onClose, onCreated }: NewOrderModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[1].id);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // amanhã
  );
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { productId: 'p1', quantity: 10 },
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(50);

  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getProduct = (id: string) => MOCK_PRODUCTS.find((p) => p.id === id);

  const subtotal = cart.reduce((acc, item) => {
    const prod = getProduct(item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const total = Math.max(0, subtotal - discount);
  const remaining = Math.max(0, total - advanceAmount);

  const handleAddItem = () => {
    setCart([...cart, { productId: MOCK_PRODUCTS[0].id, quantity: 5 }]);
  };

  const handleRemoveItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: 'productId' | 'quantity', val: any) => {
    const updated = [...cart];
    updated[index] = { ...updated[index], [field]: val };
    setCart(updated);
  };

  const handleSave = () => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId);
    const codeNumber = Math.floor(100 + Math.random() * 900);

    const newOrder: OrderData = {
      id: `ord-${codeNumber}`,
      code: `PED-${codeNumber}`,
      customerId: selectedCustomerId,
      customerName: customer ? customer.name : 'Cliente',
      customerPhone: customer?.phone !== '-' ? customer?.phone : undefined,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate,
      items: cart.map((it, idx) => {
        const prod = getProduct(it.productId)!;
        return {
          id: `oi-${idx}`,
          productId: prod.id,
          productName: prod.name,
          quantityOrdered: it.quantity,
          quantityDelivered: 0,
          quantityRemaining: it.quantity,
          unitPrice: prod.price,
          subtotal: prod.price * it.quantity,
        };
      }),
      subtotalAmount: subtotal,
      discountAmount: discount,
      totalAmount: total,
      advanceReceived: advanceAmount,
      advanceApplied: 0,
      remainingBalance: remaining,
      status: 'confirmed',
      notes,
      history: [
        {
          id: 'oh-init',
          title: 'Pedido registrado',
          description: `Nova encomenda criada para ${customer?.name}`,
          timestamp: 'Agora',
        },
      ],
    };

    onCreated(newOrder);
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
      <div className="relative w-full max-w-2xl bg-[#f8f6f0] dark:bg-[#181614] rounded-2xl border border-[#e5dfd3] dark:border-[#38322c] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between bg-[#f8f6f0] dark:bg-[#181614]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#edf3f9] dark:bg-[#1a2430] text-[#2c4a6f] dark:text-[#446d9b]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Novo Pedido / Encomenda
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Registro de solicitação com agendamento de entrega
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Cliente e Data Prevista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2c4a6f]" />
                <span>Cliente</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              >
                {MOCK_CUSTOMERS.filter((c) => c.id !== 'c1').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone !== '-' ? `— ${c.phone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#235347]" />
                <span>Data Prevista de Entrega</span>
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] focus:ring-2 focus:ring-[#235347]/40 outline-hidden"
              />
            </div>
          </div>

          {/* Itens Encomendados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Itens Solicitados
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c] font-semibold hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar produto</span>
              </button>
            </div>

            <div className="space-y-2">
              {cart.map((item, idx) => {
                const prod = getProduct(item.productId);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] flex items-center gap-3"
                  >
                    {/* Select Produto */}
                    <div className="flex-1 min-w-0">
                      <select
                        value={item.productId}
                        onChange={(e) => handleUpdateItem(idx, 'productId', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
                      >
                        {MOCK_PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatCurrency(p.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantidade */}
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-transparent text-[#2a221b] dark:text-[#f5f0eb] text-center outline-hidden"
                      />
                    </div>

                    {/* Subtotal Item */}
                    <div className="w-24 text-right font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                      {formatCurrency((prod?.price || 0) * item.quantity)}
                    </div>

                    {/* Remover */}
                    {cart.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desconto & Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#63574d] dark:text-[#c4b9ae]">
                Desconto Acordado (R$)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#63574d] dark:text-[#c4b9ae]">
                Observações Operacionais
              </label>
              <input
                type="text"
                placeholder="Ex: Laço dourado, sem lactose, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>
          </div>

          {/* Adiantamento / Sinal */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Total do Pedido:</span>
              <span className="text-[#235347] dark:text-emerald-400">{formatCurrency(total)}</span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
              <span className="font-semibold text-[#63574d] dark:text-[#c4b9ae]">
                Adiantamento Recebido (Sinal):
              </span>
              <input
                type="number"
                min="0"
                max={total}
                value={advanceAmount}
                onChange={(e) =>
                  setAdvanceAmount(Math.min(total, Math.max(0, parseFloat(e.target.value) || 0)))
                }
                className="w-32 px-3 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-right font-bold text-[#2c4a6f] dark:text-[#6ba1d6] outline-hidden"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold pt-1">
              <span className="text-[#8c7f74] dark:text-[#8a7f75]">
                Saldo Pendente (a pagar na entrega/faturamento):
              </span>
              <span className={remaining > 0 ? 'text-[#c29b38] dark:text-[#d4ac4a]' : 'text-emerald-600'}>
                {remaining > 0 ? formatCurrency(remaining) : 'Totalmente quitado antecipadamente'}
              </span>
            </div>
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
            Registrar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
