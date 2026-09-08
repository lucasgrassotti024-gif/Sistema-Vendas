'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { MetricData } from '@/types/dashboard';

interface MetricCardProps {
  metric: MetricData;
}

const ICON_MAP = {
  DollarSign: DollarSign,
  ShoppingBag: ShoppingBag,
  Clock: Clock,
  TrendingUp: TrendingUp,
};

const ACCENT_STYLES = {
  green: {
    bg: 'bg-[#e9f1ee] dark:bg-[#192723]',
    icon: 'text-[#235347] dark:text-[#377d6c]',
    border: 'border-l-[#235347] dark:border-l-[#377d6c]',
  },
  blue: {
    bg: 'bg-[#edf3f9] dark:bg-[#1a2430]',
    icon: 'text-[#2c4a6f] dark:text-[#446d9b]',
    border: 'border-l-[#2c4a6f] dark:border-l-[#446d9b]',
  },
  gold: {
    bg: 'bg-[#faf5e8] dark:bg-[#2c2415]',
    icon: 'text-[#c29b38] dark:text-[#d4ac4a]',
    border: 'border-l-[#c29b38] dark:border-l-[#d4ac4a]',
  },
  brown: {
    bg: 'bg-[#f6eee7] dark:bg-[#2a2018]',
    icon: 'text-[#4a2e18] dark:text-[#9e6d47]',
    border: 'border-l-[#4a2e18] dark:border-l-[#9e6d47]',
  },
};

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = ICON_MAP[metric.iconName];
  const style = ACCENT_STYLES[metric.accentColor];

  return (
    <div
      className={`relative p-5 rounded-2xl border border-l-4 transition-all hover:shadow-md bg-[#ffffff] dark:bg-[#1e1b18] border-[#e5dfd3] dark:border-[#38322c] ${style.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75]">
            {metric.title}
          </p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
            {metric.value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${style.bg}`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex items-center justify-between text-xs">
        <span
          className={`font-semibold ${
            metric.isPositive
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-rose-700 dark:text-rose-400'
          }`}
        >
          {metric.change}
        </span>
        <span className="text-[#8c7f74] dark:text-[#8a7f75] truncate max-w-[160px]">
          {metric.comparisonText}
        </span>
      </div>
    </div>
  );
}
