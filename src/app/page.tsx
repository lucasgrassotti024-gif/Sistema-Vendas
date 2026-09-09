'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { SalesTrendChart, FinancialOverviewCard } from '@/components/charts-section';
import { RecentActivity } from '@/components/recent-activity';
import { dashboardService, DashboardRealData } from '@/services/dashboard-service';
import { Calendar, Filter, Download } from 'lucide-react';

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [dashboardData, setDashboardData] = useState<DashboardRealData | null>(null);

  const loadData = () => {
    const data = dashboardService.getDashboardData(selectedPeriod);
    setDashboardData(data);
  };

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen flex bg-[#f8f6f0] dark:bg-[#151311] text-[#2a221b] dark:text-[#f5f0eb] transition-colors">
      {/* Reusable Responsive Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath="/"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2a221b] dark:text-[#f5f0eb]">
                Painel Operacional
              </h2>
              <p className="text-xs text-[#8c7f74] dark:text-[#8a7f75]">
                Status da produção, vendas e fluxo de caixa da Veneza Brownies em tempo real.
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Period Selector */}
              <div className="inline-flex rounded-xl p-1 bg-[#ffffff] dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] shadow-2xs">
                {[
                  { label: 'Hoje', value: 'today' },
                  { label: '7 Dias', value: '7d' },
                  { label: 'Este Mês', value: 'month' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedPeriod(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedPeriod === tab.value
                        ? 'bg-[#235347] text-white shadow-xs dark:bg-[#377d6c]'
                        : 'text-[#63574d] dark:text-[#c4b9ae] hover:text-[#2a221b] dark:hover:text-[#f5f0eb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-xs font-semibold text-[#63574d] dark:text-[#c4b9ae] hover:bg-[#f1ede4] dark:hover:bg-[#2c2824] transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-[#8c7f74]" />
                <span className="hidden sm:inline">Filtros</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => alert('Relatório sintético do painel operacional preparado.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-[#ffffff] dark:bg-[#1e1b18] text-xs font-semibold text-[#63574d] dark:text-[#c4b9ae] hover:bg-[#f1ede4] dark:hover:bg-[#2c2824] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8c7f74]" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Key Metric Indicators Grid */}
          {dashboardData && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {dashboardData.metrics.map((metric) => (
                <MetricCard key={metric.title} metric={metric} />
              ))}
            </section>
          )}

          {/* Visual Charts & Financial Health Section */}
          {dashboardData && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesTrendChart data={dashboardData.salesTrend} />
              <FinancialOverviewCard data={dashboardData.financialOverview} />
            </section>
          )}

          {/* Recent Operations & Activity Stream */}
          {dashboardData && (
            <section>
              <RecentActivity activities={dashboardData.recentActivities} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
