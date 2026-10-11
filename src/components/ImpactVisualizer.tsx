"use client";

import type { DisasterItem } from "@/types";
import { getImpact, formatNumber } from "@/lib/impact";
import { Zap, Bomb, AlertTriangle } from "lucide-react";

interface Props {
  item: DisasterItem | null;
  onClose: () => void;
}

export default function ImpactVisualizer({ item, onClose }: Props) {
  if (!item) return null;

  const impact = getImpact(item);
  const isQuake = item.kind === "earthquake";

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Impact Visualizer
            </h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
            >
              Close
            </button>
          </div>
          <p className="mt-1 text-sm opacity-90">
            {isQuake
              ? `M${item.magnitude.toFixed(1)} · ${item.place}`
              : `${item.classification} ${item.name} · ${item.windKt} kt`}
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-950/40">
            <AlertTriangle className="h-8 w-8 text-red-600 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wide text-red-600 font-semibold">
                Severity
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {impact.severityLabel}
              </p>
            </div>
          </div>

          {isQuake && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500">TNT Equivalent</p>
                  <p className="text-lg font-semibold">
                    {formatNumber(impact.tntTons)} tons
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Bomb className="h-3 w-3" /> Hiroshima Bombs
                  </p>
                  <p className="text-lg font-semibold">
                    ≈ {impact.hiroshimaBombs < 0.01
                      ? impact.hiroshimaBombs.toExponential(1)
                      : impact.hiroshimaBombs.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Energy ≈ {formatNumber(impact.energyJoules)} Joules
                (Kanamori approximation)
              </p>
            </>
          )}

          {!isQuake && impact.hiroshimaBombs > 0 && (
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs text-gray-500">Relative destructive power</p>
              <p className="text-lg font-semibold">
                ~{impact.hiroshimaBombs}× a Hiroshima-class event (illustrative)
              </p>
            </div>
          )}

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Historical context
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {impact.comparison}
            </p>
          </div>

          <p className="text-[10px] text-gray-400 text-center">
            Educational approximation only. Not for operational emergency decisions.
            Data: USGS / NHC.
          </p>
        </div>
      </div>
    </div>
  );
}
