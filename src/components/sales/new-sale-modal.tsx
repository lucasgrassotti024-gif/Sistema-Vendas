'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, User, ShoppingBag, DollarSign } from 'lucide-react';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, ProductOption, SaleData } from '@/types/sales';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newSale: SaleData) => void;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export function NewSaleModal({ isOpen, onClose, onCreated }: NewSaleModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('c1');
  const [cart, setCart] = useState<CartItem[]>([
    { productId: 'p1', quantity: 2 },
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<string>('PIX');

  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Cálculos dinâmicos
  const getProduct = (id: string) => MOCK_PRODUCTS.find((p) => p.id === id);

  const subtotal = cart.reduce((acc, item) => {
    const prod = getProduct(item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const total = Math.max(0, subtotal - discount);
  const remaining = Math.max(0, total - amountPaid);

  const handleAddItem = () => {
    setCart([...cart, { productId: MOCK_PRODUCTS[0].id, quantity: 1 }]);
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
    const codeNumber = Math.floor(1000 + Math.random() * 9000);

    const newSale: SaleData = {
      id: `s-${codeNumber}`,
      code: `VEN-${codeNumber}`,
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomerId,
      customerName: customer ? customer.name : 'Consumidor Balcão',
      items: cart.map((it, idx) => {
        const prod = getProduct(it.productId)!;
        return {
          id: `item-${idx}`,
          productId: prod.id,
          productName: prod.name,
          quantity: it.quantity,
          unitPrice: prod.price,
          subtotal: prod.price * it.quantity,
        };
      }),
      subtotalAmount: subtotal,
      discountAmount: discount,
      advanceAppliedAmount: 0,
      totalAmount: total,
      amountPaid: amountPaid,
      remainingBalance: remaining,
      status: remaining === 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending',
      paymentMethod,
      history: [
        {
          id: `h-init`,
          title: 'Venda criada',
          description: `Venda registrada para ${customer?.name}`,
          timestamp: 'Agora',
        },
      ],
    };

    onCreated(newSale);
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
            <div className="p-2 rounded-xl bg-[#e9f1ee] dark:bg-[#192723] text-[#235347] dark:text-[#377d6c]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Nova Venda
              </h3>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Faturamento rápido de produtos e liquidação
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
          {/* Cliente */}
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
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone !== '-' ? `— ${c.phone}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Itens da Venda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#2a221b] dark:text-[#f5f0eb]">
                Itens do Carrinho
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

          {/* Desconto & Composição */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="font-semibold text-[#63574d] dark:text-[#c4b9ae]">
                Desconto (R$)
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
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              >
                <option value="PIX">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão Débito">Cartão Débito</option>
                <option value="Cartão Crédito">Cartão Crédito</option>
                <option value="Faturado a Prazo">Faturado (Sem Pagamento no Ato)</option>
              </select>
            </div>
          </div>

          {/* Pagamento no Ato & Saldo Residual */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Total a Pagar:</span>
              <span className="text-[#235347] dark:text-emerald-400">{formatCurrency(total)}</span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60">
              <span className="font-semibold text-[#63574d] dark:text-[#c4b9ae]">
                Valor Pago Agora (R$):
              </span>
              <input
                type="number"
                min="0"
                max={total}
                value={amountPaid}
                onChange={(e) =>
                  setAmountPaid(Math.min(total, Math.max(0, parseFloat(e.target.value) || 0)))
                }
                className="w-32 px-3 py-1.5 rounded-lg border border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0] dark:bg-[#23201c] text-right font-bold text-[#2a221b] dark:text-[#f5f0eb] outline-hidden"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold pt-1">
              <span className="text-[#8c7f74] dark:text-[#8a7f75]">
                Saldo Restante (Conta a Receber / Fiado):
              </span>
              <span className={remaining > 0 ? 'text-[#c29b38] dark:text-[#d4ac4a]' : 'text-emerald-600'}>
                {remaining > 0 ? formatCurrency(remaining) : 'Totalmente quitado'}
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
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}
