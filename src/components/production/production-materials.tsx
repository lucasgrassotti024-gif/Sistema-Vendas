'use client';

import React from 'react';
import { ProductionMaterial } from '@/types/production';
import { Layers, Info } from 'lucide-react';

interface ProductionMaterialsProps {
  materials: ProductionMaterial[];
}

export function ProductionMaterials({ materials }: ProductionMaterialsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold tracking-wide uppercase text-[#8c7f74] dark:text-[#8a7f75] flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#2c4a6f]" />
          <span>Insumos e Receita da Ordem</span>
        </h4>
        <span className="text-[10px] text-[#8c7f74]">Base operacional</span>
      </div>

      <div className="rounded-xl border border-[#e5dfd3] dark:border-[#38322c] bg-white dark:bg-[#1e1b18] overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e5dfd3] dark:border-[#38322c] bg-[#f8f6f0]/70 dark:bg-[#23201c]/70 text-[10px] font-bold uppercase text-[#8c7f74] dark:text-[#8a7f75]">
              <th className="py-2.5 px-3">Material</th>
              <th className="py-2.5 px-3 text-right">Necessário</th>
              <th className="py-2.5 px-3 text-right">Consumido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dfd3]/60 dark:divide-[#38322c]/60">
            {materials.map((m, idx) => (
              <tr key={idx} className="hover:bg-[#f1ede4]/30 dark:hover:bg-[#23201c]/30">
                <td className="py-2.5 px-3 font-medium text-[#2a221b] dark:text-[#f5f0eb]">
                  {m.materialName}
                </td>
                <td className="py-2.5 px-3 text-right text-[#63574d] dark:text-[#c4b9ae] whitespace-nowrap">
                  {m.requiredQuantity} {m.unit}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#235347] dark:text-emerald-400 whitespace-nowrap">
                  {m.consumedQuantity} {m.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-2 text-[11px] text-blue-800 dark:text-blue-300">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          O consumo real de insumos será integrado diretamente às movimentações automáticas de estoque em etapas futuras.
        </span>
      </div>
    </div>
  );
}
