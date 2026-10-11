export interface EarthquakeFeature {
  type: "Feature";
  properties: {
    mag: number | null;
    place: string;
    time: number;
    updated: number;
    tz: number | null;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string;
    type: string;
    title?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // lon, lat, depth
  };
  id: string;
}

export interface EarthquakeCollection {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    api: string;
    count: number;
    status: number;
  };
  features: EarthquakeFeature[];
}

export interface Storm {
  id: string;
  binNumber: string;
  name: string;
  classification: string; // HU, TS, TD, etc.
  intensity: string; // wind in kt
  pressure: string;
  latitude: string;
  longitude: string;
  latitudeNumeric: number;
  longitudeNumeric: number;
  movementDir: string;
  movementSpeed: string;
  lastUpdate: string;
  publicAdvisory?: string;
  forecastDiscussion?: string;
}

export interface NHCStormsResponse {
  activeStorms: Storm[];
}

export type DisasterItem =
  | {
      kind: "earthquake";
      id: string;
      title: string;
      magnitude: number;
      place: string;
      time: number;
      lat: number;
      lon: number;
      depth: number;
      url: string;
      tsunami: boolean;
    }
  | {
      kind: "storm";
      id: string;
      name: string;
      classification: string;
      windKt: number;
      pressure: number | null;
      lat: number;
      lon: number;
      lastUpdate: string;
      movement: string;
      url?: string;
    };

export interface ImpactResult {
  energyJoules: number;
  tntTons: number;
  hiroshimaBombs: number;
  comparison: string;
  severityLabel: string;
}
