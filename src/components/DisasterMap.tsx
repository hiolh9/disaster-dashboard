"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { DisasterItem } from "@/types";
import "leaflet/dist/leaflet.css";

interface Props {
  items: DisasterItem[];
  selectedId: string | null;
  onSelect: (item: DisasterItem) => void;
  emergencyMode: boolean;
}

function FitBounds({ items }: { items: DisasterItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (items.length === 0) return;
    if (items.length <= 5) {
      const lats = items.map((i) => i.lat);
      const lons = items.map((i) => i.lon);
      map.fitBounds(
        [
          [Math.min(...lats) - 5, Math.min(...lons) - 5],
          [Math.max(...lats) + 5, Math.max(...lons) + 5],
        ],
        { padding: [40, 40] }
      );
    }
  }, [items, map]);
  return null;
}

function getColor(item: DisasterItem): string {
  if (item.kind === "storm") {
    if (item.windKt >= 113) return "#7f0000";
    if (item.windKt >= 64) return "#e31a1c";
    return "#fd8d3c";
  }
  if (item.magnitude >= 6.0) return "#e31a1c";
  if (item.magnitude >= 4.5) return "#fd8d3c";
  return "#31a354";
}

function getRadius(item: DisasterItem): number {
  if (item.kind === "storm") {
    return Math.min(8 + item.windKt / 15, 22);
  }
  return Math.min(6 + item.magnitude * 1.8, 20);
}

export default function DisasterMap({
  items,
  selectedId,
  onSelect,
  emergencyMode,
}: Props) {
  const center: [number, number] = [20, 0];

  const markers = useMemo(
    () =>
      items.map((item) => (
        <CircleMarker
          key={item.id}
          center={[item.lat, item.lon]}
          radius={getRadius(item)}
          pathOptions={{
            color: emergencyMode ? "#000" : getColor(item),
            fillColor: emergencyMode ? "#fff" : getColor(item),
            fillOpacity: emergencyMode ? 0.9 : 0.75,
            weight: selectedId === item.id ? 3 : 1,
          }}
          eventHandlers={{
            click: () => onSelect(item),
          }}
        >
          <Popup>
            <div className="min-w-[200px] text-sm">
              {item.kind === "earthquake" ? (
                <>
                  <p className="font-bold text-base">
                    M{item.magnitude.toFixed(1)} Earthquake
                  </p>
                  <p className="text-gray-700">{item.place}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.time).toUTCString()}
                  </p>
                  <p className="text-xs">Depth: {item.depth.toFixed(1)} km</p>
                  {item.tsunami && (
                    <p className="text-red-600 font-semibold text-xs mt-1">
                      Tsunami flag
                    </p>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs mt-2 inline-block"
                  >
                    USGS detail →
                  </a>
                </>
              ) : (
                <>
                  <p className="font-bold text-base">
                    {item.classification} {item.name}
                  </p>
                  <p className="text-gray-700">
                    Max winds: {item.windKt} kt ({Math.round(item.windKt * 1.15)} mph)
                  </p>
                  {item.pressure && (
                    <p className="text-xs">Pressure: {item.pressure} mb</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {item.lastUpdate}
                  </p>
                  <p className="text-xs">Movement: {item.movement}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs mt-2 inline-block"
                    >
                      NHC graphics →
                    </a>
                  )}
                </>
              )}
              <button
                onClick={() => onSelect(item)}
                className="mt-2 w-full rounded bg-orange-500 px-2 py-1 text-xs text-white hover:bg-orange-600"
              >
                Open Impact Visualizer
              </button>
            </div>
          </Popup>
        </CircleMarker>
      )),
    [items, selectedId, onSelect, emergencyMode]
  );

  return (
    <MapContainer
      center={center}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
      style={{ background: emergencyMode ? "#111" : undefined }}
    >
      <TileLayer
        attribution={
          emergencyMode
            ? ""
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
        url={
          emergencyMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      <FitBounds items={items} />
      {markers}
    </MapContainer>
  );
}
