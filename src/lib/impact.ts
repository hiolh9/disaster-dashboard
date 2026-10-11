import type { DisasterItem, ImpactResult } from "@/types";

/**
 * Seismic moment energy approximation (Kanamori):
 * Energy (Joules) ≈ 10^(1.5 * Mw + 4.8)
 * Then convert to TNT equivalent (1 ton TNT ≈ 4.184e9 J)
 * Hiroshima bomb ≈ 15 kilotons TNT
 */
export function calculateEarthquakeImpact(magnitude: number): ImpactResult {
  // Moment magnitude energy in Joules
  const energyJoules = Math.pow(10, 1.5 * magnitude + 4.8);
  const tntTons = energyJoules / 4.184e9;
  const hiroshimaBombs = tntTons / 15000; // ~15 kt

  let comparison = "";
  let severityLabel = "";

  if (magnitude < 4.0) {
    severityLabel = "Minor";
    comparison = "Similar to a small local tremor; rarely causes damage.";
  } else if (magnitude < 5.0) {
    severityLabel = "Light";
    comparison =
      "Comparable to the 2014 Napa Valley quake (M6.0 was stronger) — light damage possible near epicenter.";
  } else if (magnitude < 6.0) {
    severityLabel = "Moderate";
    comparison =
      "Energy roughly equivalent to the 1989 Loma Prieta aftershock series or a small nuclear test.";
  } else if (magnitude < 7.0) {
    severityLabel = "Strong";
    comparison =
      "Similar energy to the 1994 Northridge earthquake (M6.7) — significant structural damage possible.";
  } else if (magnitude < 8.0) {
    severityLabel = "Major";
    comparison =
      "Comparable to the 1906 San Francisco quake (~M7.9) or 2010 Haiti (M7.0) — widespread devastation risk.";
  } else if (magnitude < 9.0) {
    severityLabel = "Great";
    comparison =
      "On the scale of the 1964 Alaska (M9.2) or 2011 Tohoku (M9.1) megathrust events — catastrophic regional impact.";
  } else {
    severityLabel = "Extreme";
    comparison =
      "Among the largest recorded (1960 Chile M9.5) — global seismic waves, potential mega-tsunami.";
  }

  return {
    energyJoules,
    tntTons,
    hiroshimaBombs,
    comparison,
    severityLabel,
  };
}

/**
 * Saffir-Simpson based wind impact for tropical cyclones.
 * Wind in knots.
 */
export function calculateStormImpact(windKt: number, name: string): ImpactResult {
  const windMph = windKt * 1.15078;
  // Rough kinetic energy scaling is complex; we use category for comparison
  let severityLabel = "";
  let comparison = "";
  let hiroshimaBombs = 0; // not directly applicable; use relative power

  if (windKt < 34) {
    severityLabel = "Tropical Depression";
    comparison = "Organized convection, winds below tropical storm force.";
  } else if (windKt < 64) {
    severityLabel = "Tropical Storm";
    comparison = `Like Tropical Storm Elsa (2021) — heavy rain and gusty winds. Named: ${name}.`;
  } else if (windKt < 83) {
    severityLabel = "Category 1 Hurricane";
    comparison =
      "Comparable to Hurricane Sandy (2012 landfall intensity) — dangerous winds, storm surge possible.";
    hiroshimaBombs = 0.5;
  } else if (windKt < 96) {
    severityLabel = "Category 2 Hurricane";
    comparison =
      "Similar to Hurricane Ike (2008) — extensive damage to roofs and vegetation.";
    hiroshimaBombs = 1;
  } else if (windKt < 113) {
    severityLabel = "Category 3 Hurricane (Major)";
    comparison =
      "On the scale of Hurricane Katrina (2005 at landfall ~Cat 3) — devastating structural damage.";
    hiroshimaBombs = 3;
  } else if (windKt < 137) {
    severityLabel = "Category 4 Hurricane";
    comparison =
      "Comparable to Hurricane Harvey (2017) or Irma (2017) — catastrophic damage, long-term power outages.";
    hiroshimaBombs = 8;
  } else {
    severityLabel = "Category 5 Hurricane";
    comparison =
      "Like Hurricane Dorian (2019) or Maria (2017) — complete destruction of framed buildings near the core.";
    hiroshimaBombs = 20;
  }

  // Approximate "energy" relative scale for display
  const energyJoules = Math.pow(windMph / 10, 3) * 1e12; // toy scaling
  const tntTons = energyJoules / 4.184e9;

  return {
    energyJoules,
    tntTons,
    hiroshimaBombs,
    comparison,
    severityLabel,
  };
}

export function getImpact(item: DisasterItem): ImpactResult {
  if (item.kind === "earthquake") {
    return calculateEarthquakeImpact(item.magnitude);
  }
  return calculateStormImpact(item.windKt, item.name);
}

export function formatNumber(n: number, digits = 1): string {
  if (n >= 1e9) return (n / 1e9).toFixed(digits) + " billion";
  if (n >= 1e6) return (n / 1e6).toFixed(digits) + " million";
  if (n >= 1e3) return (n / 1e3).toFixed(digits) + " thousand";
  return n.toFixed(digits);
}
