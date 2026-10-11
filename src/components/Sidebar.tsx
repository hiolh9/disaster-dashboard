"use client";

import { useMemo, useState } from "react";
import type { DisasterItem } from "@/types";
import { Search, Activity, CloudLightning, RefreshCw } from "lucide-react";

interface Props {
  items: DisasterItem[];
  loading: boolean;
  onSelect: (item: DisasterItem) => void;
  selectedId: string | null;
  emergencyMode: boolean;
  onRefresh: () => void;
}

export default function Sidebar({
  items,
  loading,
  onSelect,
  selectedId,
  emergencyMode,
  onRefresh,
}: Props) {
  const [query, setQuery] = useState("");
  const [minMag, setMinMag] = useState(0);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (item.kind === "earthquake") {
        if (item.magnitude < minMag) return false;
        const q = query.toLowerCase();
        if (
          q &&
          !item.place.toLowerCase().includes(q) &&
          !item.title.toLowerCase().includes(q)
        )
          return false;
      } else {
        if (minMag > 0) return false; // simple filter: mag only for quakes
        const q = query.toLowerCase();
        if (
          q &&
          !item.name.toLowerCase().includes(q) &&
          !item.classification.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, query, minMag]);

  return (
    <aside
      className={`flex h-full w-full flex-col border-r ${
        emergencyMode
          ? "border-white bg-black text-white"
          : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      }`}
    >
      <div
        className={`shrink-0 border-b p-4 ${
          emergencyMode ? "border-white" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h1
            className={`text-lg font-bold tracking-tight ${
              emergencyMode ? "text-white text-xl" : ""
            }`}
          >
            {emergencyMode ? "EMERGENCY FEED" : "Live Disasters"}
          </h1>
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`rounded p-1.5 ${
              emergencyMode
                ? "bg-white text-black"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800"
            }`}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by place or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 ${
              emergencyMode
                ? "border-white bg-black text-white placeholder:text-gray-400"
                : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
            }`}
          />
        </div>

        {!emergencyMode && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <label>Min Mag:</label>
            <input
              type="range"
              min={0}
              max={7}
              step={0.5}
              value={minMag}
              onChange={(e) => setMinMag(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-8 text-right">{minMag || "All"}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && items.length === 0 ? (
          <p className="p-4 text-center text-sm opacity-70">Loading live data…</p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-center text-sm opacity-70">No matching events</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full px-4 py-3 text-left transition ${
                    selectedId === item.id
                      ? emergencyMode
                        ? "bg-white text-black"
                        : "bg-orange-50 dark:bg-orange-950/40"
                      : emergencyMode
                      ? "hover:bg-gray-900"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {item.kind === "earthquake" ? (
                      <Activity
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          item.magnitude >= 6
                            ? "text-red-500"
                            : item.magnitude >= 4.5
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      />
                    ) : (
                      <CloudLightning className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      {item.kind === "earthquake" ? (
                        <>
                          <p
                            className={`font-semibold truncate ${
                              emergencyMode ? "text-base" : "text-sm"
                            }`}
                          >
                            M{item.magnitude.toFixed(1)} · {item.place}
                          </p>
                          <p className="text-xs opacity-70 truncate">
                            {new Date(item.time).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p
                            className={`font-semibold truncate ${
                              emergencyMode ? "text-base" : "text-sm"
                            }`}
                          >
                            {item.classification} {item.name}
                          </p>
                          <p className="text-xs opacity-70">
                            {item.windKt} kt · {item.movement}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={`shrink-0 border-t p-3 text-[10px] opacity-60 ${
          emergencyMode ? "border-white" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        Data: USGS Earthquake Hazards · NHC Active Storms · OpenStreetMap
        <br />
        Free public feeds · No API keys required
      </div>
    </aside>
  );
}
