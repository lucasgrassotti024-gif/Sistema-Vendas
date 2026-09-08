'use client';

import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  title?: string;
  description?: string;
  onOpenMobileMenu: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({
  title = 'Visão Geral',
  description = 'Acompanhe os principais indicadores do negócio.',
  onOpenMobileMenu,
  actionButton,
}: HeaderProps) {
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
            {title}
          </h2>
          <p className="hidden sm:block text-xs text-[#8c7f74] dark:text-[#8a7f75]">
            {description}
          </p>
        </div>
      </div>

      {/* Right Controls: Action Button, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </button>
        )}

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
