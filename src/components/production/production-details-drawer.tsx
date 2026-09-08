'use client';

import React from 'react';
import { ProductionOrder, STATUS_LABELS } from '@/types/production';
import { ProductionProgress } from './production-progress';
import { ProductionMaterials } from './production-materials';
import { ProductionResult } from './production-result';
import {
  X,
  Calendar,
  User,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

interface ProductionDetailsDrawerProps {
  order: ProductionOrder | null;
  onClose: () => void;
  onOpenFinalize: (order: ProductionOrder) => void;
}

export function ProductionDetailsDrawer({
  order,
  onClose,
  onOpenFinalize,
}: ProductionDetailsDrawerProps) {
  if (!order) return null;

  const badge = STATUS_LABELS[order.status];
  const isCompleted = order.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg h-full flex flex-col bg-[#f8f6f0] dark:bg-[#181614] border-l border-[#e5dfd3] dark:border-[#38322c] shadow-2xl z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#e5dfd3] dark:border-[#38322c] flex items-center justify-between sticky top-0 bg-[#f8f6f0]/90 dark:bg-[#181614]/90 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#8c7f74] dark:text-[#8a7f75]">
                {order.orderNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${badge.style}`}>
                {badge.label}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#2a221b] dark:text-[#f5f0eb] mt-0.5 truncate max-w-[280px]">
              {order.productName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8c7f74] hover:text-[#2a221b] dark:hover:text-[#f5f0eb] hover:bg-[#f1ede4] dark:hover:bg-[#23201c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Ação de Finalização */}
          {!isCompleted && order.status !== 'cancelled' && (
            <button
              onClick={() => onOpenFinalize(order)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#235347] hover:bg-[#1c4238] dark:bg-[#377d6c] dark:hover:bg-[#459682] text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar e Apontar Ordem de Produção</span>
            </button>
          )}

          {/* Indicador de Progresso */}
          <ProductionProgress order={order} />

          {/* Resultado de Rendimento (se concluída) */}
          <ProductionResult order={order} />

          {/* Informações Gerais da Ordem */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1b18] border border-[#e5dfd3] dark:border-[#38322c] space-y-3 shadow-xs">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8c7f74] dark:text-[#8a7f75]">
              Informações da Ordem
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[#8c7f74] block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Programada para:</span>
                </span>
                <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                  {order.scheduledDate}
                </strong>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8c7f74] block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Conclusão:</span>
                </span>
                <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                  {order.completedDate || 'Em andamento'}
                </strong>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8c7f74] block flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Responsável:</span>
                </span>
                <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                  {order.responsibleName}
                </strong>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8c7f74] block">Lote Planejado:</span>
                <strong className="text-[#2a221b] dark:text-[#f5f0eb]">
                  {order.plannedQuantity} unidades
                </strong>
              </div>
            </div>

            {order.notes && (
              <div className="pt-2 border-t border-[#e5dfd3]/60 dark:border-[#38322c]/60 flex items-start gap-1.5 text-[11px] text-[#8c7f74]">
                <FileText className="w-3.5 h-3.5 shrink-0 text-[#c29b38] mt-0.5" />
                <span>{order.notes}</span>
              </div>
            )}
          </div>

          {/* Insumos & Receita Mockada */}
          <ProductionMaterials materials={order.materials} />
        </div>
      </div>
    </div>
  );
}
