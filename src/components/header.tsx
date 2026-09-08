'use client';

import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-18 px-4 sm:px-8 border-b flex items-center justify-between gap-4 backdrop-blur-md bg-[#f8f6f0]/85 dark:bg-[#151311]/85 border-[#e5dfd3] dark:border-[#38322c]">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-stone-100 dark:bg-stone-800 text-[#63574d] dark:text-stone-300 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
            Visão Geral
          </h2>
          <p className="hidden sm:block text-xs text-[#8c7f74] dark:text-[#8a7f75]">
            Acompanhe os principais indicadores do negócio.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-[#8c7f74]" />
          <input
            type="text"
            placeholder="Buscar vendas, clientes, lotes..."
            className="w-64 pl-9 pr-4 py-1.5 text-xs rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-[#2a221b] dark:text-[#f5f0eb] placeholder-[#8c7f74] focus:outline-hidden focus:ring-2 focus:ring-[#235347]/40"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notificações"
          className="relative p-2 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-[#63574d] dark:text-stone-300 hover:bg-[#f1ede4] dark:hover:bg-[#2c2824] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c29b38]" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 sm:border-l border-[#e5dfd3] dark:border-[#38322c]">
          <div className="w-8 h-8 rounded-xl bg-[#235347] text-[#faf5e8] flex items-center justify-center text-xs font-bold shadow-xs">
            L
          </div>
          <span className="hidden xl:inline text-xs font-semibold text-[#2a221b] dark:text-[#f5f0eb]">
            Lucas G.
          </span>
        </div>
      </div>
    </header>
  );
}
