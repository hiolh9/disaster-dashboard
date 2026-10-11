# Global Disaster Live Dashboard

Real-time global earthquake & tropical cyclone visualization built with **Next.js (App Router) + Tailwind CSS + react-leaflet**.

Pure static / serverless frontend. All data is fetched client-side from free public feeds — **no API keys, no custom backend**.

## Features

- **Interactive Leaflet map** with color-coded CircleMarkers for earthquakes (by magnitude) and active tropical storms/hurricanes.
- **Live sidebar** with search/filter and severity ordering.
- **Impact Visualizer**: one-click energy conversion (seismic moment → TNT / Hiroshima equivalents) + historical context.
- **Emergency Ultra-Light Mode**: high-contrast, zero-animation, dark map for low-signal / low-battery disaster zones.

## Data Sources (100% free, no key)

| Source | Endpoint | License / Notes |
|--------|----------|-----------------|
| USGS Earthquake Hazards | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson` | Public domain U.S. Government data |
| National Hurricane Center | `https://www.nhc.noaa.gov/CurrentStorms.json` | Public U.S. Government data |
| OpenStreetMap tiles | `https://{s}.tile.openstreetmap.org/...` | ODbL |

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Leaflet + react-leaflet (MIT)
- Lucide React icons (ISC)

All libraries are MIT / Apache-2.0 / ISC — commercial-friendly.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (one-click static)

1. Push this repo to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js**. Build command & output are auto-detected.
4. Deploy. The site is fully static + client-side fetch — works on the free Hobby plan.

Alternatively:

```bash
npx vercel
```

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout + metadata
    page.tsx            # Main client page (map + sidebar + modes)
    globals.css
  components/
    DisasterMap.tsx     # react-leaflet map (dynamic, ssr:false)
    Sidebar.tsx         # Live list + filters
    ImpactVisualizer.tsx
  lib/
    api.ts              # Client-side fetch wrappers
    impact.ts           # Energy / category calculators
  types/
    index.ts
```

## Notes

- Leaflet is loaded only on the client (`dynamic(..., { ssr: false })`) to avoid window errors.
- Data auto-refreshes every 5 minutes.
- Impact numbers are educational approximations (Kanamori energy formula for quakes; Saffir-Simpson categories for storms).

## License

MIT — free for commercial and non-commercial use.
