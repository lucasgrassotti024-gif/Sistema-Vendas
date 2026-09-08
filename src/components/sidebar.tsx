'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Flame,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
}

export const NAV_ITEMS = [
  { label: 'Início', icon: LayoutDashboard, href: '/' },
  { label: 'Vendas', icon: ShoppingCart, href: '/vendas' },
  { label: 'Pedidos', icon: ShoppingBag, href: '/pedidos' },
  { label: 'Clientes', icon: Users, href: '/clientes' },
  { label: 'Produtos', icon: Package, href: '/produtos' },
  { label: 'Estoque', icon: Layers, href: '/estoque' },
  { label: 'Produção', icon: Flame, href: '/producao' },
  { label: 'Compras', icon: Truck, href: '/compras' },
  { label: 'Financeiro', icon: DollarSign, href: '/financeiro' },
  { label: 'Relatórios', icon: BarChart3, href: '#' },
  { label: 'Configurações', icon: Settings, href: '#' },
];

export function Sidebar({ isOpen, onClose, activePath = '/' }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 bg-[#f8f6f0] dark:bg-[#181614] border-[#e5dfd3] dark:border-[#38322c] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-[#e5dfd3] dark:border-[#38322c]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#235347] flex items-center justify-center text-[#faf5e8] font-bold text-lg shadow-sm">
              V
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
                Veneza Brownies
              </h1>
              <p className="text-[11px] font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
                Gestão Integrada
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#235347] text-white shadow-xs dark:bg-[#2e6b5c]'
                    : 'text-[#63574d] dark:text-[#c4b9ae] hover:bg-[#ece6d8] dark:hover:bg-[#23201c] hover:text-[#2a221b] dark:hover:text-[#f5f0eb]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#d4ac4a]'
                      : 'text-[#8c7f74] dark:text-[#8a7f75] group-hover:text-[#235347] dark:group-hover:text-[#d4ac4a]'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4ac4a]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#e5dfd3] dark:border-[#38322c]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f1ede4] dark:bg-[#23201c] border border-[#e5dfd3]/60 dark:border-[#38322c]">
            <div className="w-8 h-8 rounded-lg bg-[#4a2e18] dark:bg-[#5c3a20] text-amber-200 flex items-center justify-center text-xs font-bold">
              LG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-[#2a221b] dark:text-[#f5f0eb]">
                Lucas Grassotti
              </p>
              <p className="text-[10px] truncate text-[#8c7f74] dark:text-[#8a7f75]">
                Administrador
              </p>
            </div>
            <a
              href="#"
              title="Configurações"
              className="p-1 rounded-md text-[#8c7f74] hover:text-[#2a221b] dark:hover:text-stone-200"
            >
              <Settings className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
