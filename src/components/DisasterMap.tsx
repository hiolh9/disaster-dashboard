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
    if (item.windKt >= 113) return "#991b1b";
    if (item.windKt >= 64) return "#dc2626";
    return "#ea580c";
  }
  if (item.magnitude >= 6.0) return "#dc2626";
  if (item.magnitude >= 4.5) return "#ea580c";
  return "#16a34a";
}

function getRadius(item: DisasterItem): number {
  if (item.kind === "storm") {
    return Math.min(10 + item.windKt / 12, 26);
  }
  return Math.min(8 + item.magnitude * 2, 24);
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
            color: emergencyMode ? "#000000" : "#ffffff",
            fillColor: emergencyMode ? "#ffffff" : getColor(item),
            fillOpacity: emergencyMode ? 0.95 : 0.85,
            weight: selectedId === item.id ? 3 : 2,
            opacity: 1,
          }}
          eventHandlers={{
            click: () => onSelect(item),
          }}
        >
          <Popup>
            <div>
              {item.kind === "earthquake" ? (
                <>
                  <p className="disaster-popup-title">
                    M{item.magnitude.toFixed(1)} Earthquake
                  </p>
                  <p className="disaster-popup-place">{item.place}</p>
                  <p className="disaster-popup-meta">
                    {new Date(item.time).toUTCString()}
                  </p>
                  <p className="disaster-popup-meta">
                    Depth: {item.depth.toFixed(1)} km
                  </p>
                  {item.tsunami ? (
                    <p
                      className="disaster-popup-meta"
                      style={{ color: "#b91c1c", fontWeight: 600 }}
                    >
                      Tsunami flag
                    </p>
                  ) : null}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="disaster-popup-link"
                  >
                    USGS detail →
                  </a>
                </>
              ) : (
                <>
                  <p className="disaster-popup-title">
                    {item.classification} {item.name}
                  </p>
                  <p className="disaster-popup-place">
                    Max winds: {item.windKt} kt ({
                      Math.round(item.windKt * 1.15)
                    }{" "}
                    mph)
                  </p>
                  {item.pressure ? (
                    <p className="disaster-popup-meta">
                      Pressure: {item.pressure} mb
                    </p>
                  ) : null}
                  <p className="disaster-popup-meta">
                    Updated: {item.lastUpdate}
                  </p>
                  <p className="disaster-popup-meta">
                    Movement: {item.movement}
                  </p>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="disaster-popup-link"
                    >
                      NHC graphics →
                    </a>
                  ) : null}
                </>
              )}
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="disaster-popup-btn"
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
