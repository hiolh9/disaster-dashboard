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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
        <div className="bg-orange-600 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Zap className="h-5 w-5" />
              Impact Visualizer
            </h2>
            <button
              onClick={onClose}
              className="rounded bg-white/25 px-3 py-1 text-sm font-medium text-white hover:bg-white/40"
            >
              Close
            </button>
          </div>
          <p className="mt-1 text-sm text-orange-50">
            {isQuake
              ? `M${item.magnitude.toFixed(1)} · ${item.place}`
              : `${item.classification} ${item.name} · ${item.windKt} kt`}
          </p>
        </div>

        <div className="space-y-4 p-5 text-gray-900">
          <div className="flex items-center gap-3 rounded border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="h-8 w-8 shrink-0 text-red-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                Severity
              </p>
              <p className="text-xl font-bold text-gray-900">
                {impact.severityLabel}
              </p>
            </div>
          </div>

          {isQuake && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded border border-gray-300 bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">TNT Equivalent</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(impact.tntTons)} tons
                  </p>
                </div>
                <div className="rounded border border-gray-300 bg-gray-50 p-3">
                  <p className="flex items-center gap-1 text-xs text-gray-600">
                    <Bomb className="h-3 w-3" /> Hiroshima Bombs
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ≈{" "}
                    {impact.hiroshimaBombs < 0.01
                      ? impact.hiroshimaBombs.toExponential(1)
                      : impact.hiroshimaBombs.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Energy ≈ {formatNumber(impact.energyJoules)} Joules (Kanamori
                approximation)
              </p>
            </>
          )}

          {!isQuake && impact.hiroshimaBombs > 0 && (
            <div className="rounded border border-gray-300 bg-gray-50 p-3">
              <p className="text-xs text-gray-600">Relative destructive power</p>
              <p className="text-lg font-semibold text-gray-900">
                ~{impact.hiroshimaBombs}× a Hiroshima-class event (illustrative)
              </p>
            </div>
          )}

          <div className="rounded border border-gray-300 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Historical context
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {impact.comparison}
            </p>
          </div>

          <p className="text-center text-[11px] text-gray-500">
            Educational approximation only. Not for operational emergency
            decisions. Data: USGS / NHC.
          </p>
        </div>
      </div>
    </div>
  );
}
