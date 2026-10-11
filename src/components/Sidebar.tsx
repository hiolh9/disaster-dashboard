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
        if (minMag > 0) return false;
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
          : "border-gray-300 bg-white text-gray-900"
      }`}
    >
      <div
        className={`shrink-0 border-b px-4 py-4 ${
          emergencyMode ? "border-white" : "border-gray-300"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h1
            className={`font-bold ${
              emergencyMode ? "text-xl text-white" : "text-xl text-gray-900"
            }`}
          >
            {emergencyMode ? "EMERGENCY FEED" : "Live Disasters"}
          </h1>
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`rounded p-2 ${
              emergencyMode
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by place or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full rounded border py-2.5 pl-10 pr-3 text-base outline-none focus:ring-2 focus:ring-orange-500 ${
              emergencyMode
                ? "border-white bg-black text-white placeholder:text-gray-400"
                : "border-gray-400 bg-white text-gray-900 placeholder:text-gray-500"
            }`}
          />
        </div>

        {!emergencyMode && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <label className="shrink-0">Min Mag:</label>
            <input
              type="range"
              min={0}
              max={7}
              step={0.5}
              value={minMag}
              onChange={(e) => setMinMag(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-10 text-right font-medium text-gray-900">
              {minMag || "All"}
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-scroll flex-1 overflow-y-auto">
        {loading && items.length === 0 ? (
          <p className="p-4 text-center text-base text-gray-600">
            Loading live data…
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-center text-base text-gray-600">
            No matching events
          </p>
        ) : (
          <ul
            className={
              emergencyMode
                ? "divide-y divide-gray-700"
                : "divide-y divide-gray-200"
            }
          >
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full px-4 py-3.5 text-left ${
                    selectedId === item.id
                      ? emergencyMode
                        ? "bg-white text-black"
                        : "bg-orange-100 text-gray-900"
                      : emergencyMode
                      ? "text-white hover:bg-gray-900"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.kind === "earthquake" ? (
                      <Activity
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          item.magnitude >= 6
                            ? "text-red-600"
                            : item.magnitude >= 4.5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      />
                    ) : (
                      <CloudLightning className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    )}
                    <div className="min-w-0 flex-1">
                      {item.kind === "earthquake" ? (
                        <>
                          <p className="text-base font-semibold leading-snug">
                            M{item.magnitude.toFixed(1)} · {item.place}
                          </p>
                          <p
                            className={`mt-0.5 text-sm ${
                              emergencyMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {new Date(item.time).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-semibold leading-snug">
                            {item.classification} {item.name}
                          </p>
                          <p
                            className={`mt-0.5 text-sm ${
                              emergencyMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
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
        className={`shrink-0 border-t px-4 py-3 text-xs ${
          emergencyMode
            ? "border-white text-gray-300"
            : "border-gray-300 text-gray-600"
        }`}
      >
        Data: USGS · NHC · OpenStreetMap
        <br />
        Free public feeds · No API keys
      </div>
    </aside>
  );
}
