"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { DisasterItem } from "@/types";
import { fetchAllDisasters } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ImpactVisualizer from "@/components/ImpactVisualizer";
import { ShieldAlert, Sun } from "lucide-react";

const DisasterMap = dynamic(() => import("@/components/DisasterMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
      Loading map…
    </div>
  ),
});

export default function HomePage() {
  const [items, setItems] = useState<DisasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DisasterItem | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllDisasters();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(id);
  }, [load]);

  const handleSelect = (item: DisasterItem) => {
    setSelected(item);
    setShowImpact(true);
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        emergencyMode ? "emergency-mode bg-black text-white" : "bg-white"
      }`}
    >
      {/* Sidebar */}
      <div className="w-full max-w-sm shrink-0 md:w-96">
        <Sidebar
          items={items}
          loading={loading}
          onSelect={handleSelect}
          selectedId={selected?.id ?? null}
          emergencyMode={emergencyMode}
          onRefresh={load}
        />
      </div>

      {/* Map area */}
      <div className="relative flex-1">
        <DisasterMap
          items={items}
          selectedId={selected?.id ?? null}
          onSelect={handleSelect}
          emergencyMode={emergencyMode}
        />

        {/* Floating controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => setEmergencyMode((v) => !v)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg transition ${
              emergencyMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
            title="Toggle Emergency Ultra-Light Mode"
          >
            {emergencyMode ? (
              <>
                <Sun className="h-4 w-4" />
                Exit Emergency Mode
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Emergency Mode
              </>
            )}
          </button>
        </div>

        {/* Legend */}
        {!emergencyMode && (
          <div className="absolute bottom-6 left-4 z-[1000] rounded-lg bg-white/95 px-4 py-3 text-xs shadow-md backdrop-blur">
            <p className="font-semibold mb-1.5">Legend</p>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#31a354]" />
                Quake < 4.5
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#fd8d3c]" />
                Quake 4.5–6.0 / Tropical Storm
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#e31a1c]" />
                Quake ≥ 6.0 / Hurricane
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#7f0000]" />
                Major Hurricane (Cat 4+)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Impact Visualizer modal */}
      {showImpact && (
        <ImpactVisualizer
          item={selected}
          onClose={() => setShowImpact(false)}
        />
      )}
    </div>
  );
}
