import type { EarthquakeCollection, NHCStormsResponse, DisasterItem } from "@/types";

const USGS_FEED =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
// Alternative feeds:
// all_hour, all_day, 2.5_week, 4.5_week, significant_month

const NHC_STORMS = "https://www.nhc.noaa.gov/CurrentStorms.json";

export async function fetchEarthquakes(): Promise<DisasterItem[]> {
  try {
    const res = await fetch(USGS_FEED, { cache: "no-store" });
    if (!res.ok) throw new Error(`USGS error: ${res.status}`);
    const data: EarthquakeCollection = await res.json();

    return data.features
      .filter((f) => f.properties.mag != null && f.properties.mag >= 2.5)
      .map((f) => ({
        kind: "earthquake" as const,
        id: f.id,
        title: f.properties.title || `M${f.properties.mag} - ${f.properties.place}`,
        magnitude: f.properties.mag as number,
        place: f.properties.place,
        time: f.properties.time,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
        url: f.properties.url,
        tsunami: f.properties.tsunami === 1,
      }))
      .sort((a, b) => b.magnitude - a.magnitude);
  } catch (err) {
    console.error("Failed to fetch earthquakes:", err);
    return [];
  }
}

export async function fetchStorms(): Promise<DisasterItem[]> {
  try {
    const res = await fetch(NHC_STORMS, { cache: "no-store" });
    if (!res.ok) throw new Error(`NHC error: ${res.status}`);
    const data: NHCStormsResponse = await res.json();

    if (!data.activeStorms || data.activeStorms.length === 0) return [];

    return data.activeStorms.map((s) => {
      const windKt = parseFloat(s.intensity) || 0;
      const pressure = s.pressure ? parseFloat(s.pressure) : null;
      return {
        kind: "storm" as const,
        id: s.id,
        name: s.name,
        classification: s.classification,
        windKt,
        pressure,
        lat: s.latitudeNumeric,
        lon: s.longitudeNumeric,
        lastUpdate: s.lastUpdate,
        movement: `${s.movementDir} at ${s.movementSpeed} kt`,
        url: `https://www.nhc.noaa.gov/graphics_${s.binNumber?.toLowerCase() || "at"}.shtml`,
      };
    });
  } catch (err) {
    console.error("Failed to fetch storms:", err);
    return [];
  }
}

export async function fetchAllDisasters(): Promise<DisasterItem[]> {
  const [quakes, storms] = await Promise.all([
    fetchEarthquakes(),
    fetchStorms(),
  ]);
  // Storms first if any, then quakes sorted by mag already
  return [...storms, ...quakes];
}
