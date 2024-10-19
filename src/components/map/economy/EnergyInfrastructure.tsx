import L from "leaflet";

export function overPassQuery(activeAdministrativeRegion) {
  // ⚡
  return `
 [out:json][timeout:25];
 
 // Fetch area for the selected region
 area["ISO3166-1"="${activeAdministrativeRegion["alpha-2"]}"]->.name;
 (
   // Fetch features based on the active location type (e.g., aerodromes)
   nwr["power"="plant"](area.name);
 );
 
 out geom;
 `;
}

/*
  POWER PLANTS
*/

const power = L.divIcon({
  html: "⚡",
  className: "emoji-icon emoji-category",
});

// Wind Power Plant
const wind = L.divIcon({
  html: "🌬️",
  className: "emoji-icon",
});

// Solar Power Plant
const solar = L.divIcon({
  html: "☀️",
  className: "emoji-icon",
});

// Biomass Power Plant
const biomass = L.divIcon({
  html: "🌿",
  className: "emoji-icon",
});

// Hydroelectric Power Station
const hydro = L.divIcon({
  html: "🌊",
  className: "emoji-icon",
});

// Coal-fired Power Station
const coal = L.divIcon({
  html: "🌑",
  className: "emoji-icon",
});

// Gas-fired Power Station
const gas = L.divIcon({
  html: "💧",
  className: "emoji-icon",
});

// Oil-fired Power Plant
const oil = L.divIcon({
  html: "🛢️",
  className: "emoji-icon",
});

// Geothermal Energy Power Plant
const geothermal = L.divIcon({
  html: "♨️",
  className: "emoji-icon",
});

// Nuclear Power Plant
const nuclear = L.divIcon({
  html: "☢️",
  className: "emoji-icon",
});

// Waste Incineration Plants
const waste = L.divIcon({
  html: "🗑️",
  className: "emoji-icon",
});

// Battery Storage Plant
const battery = L.divIcon({
  html: "🔋",
  className: "emoji-icon",
});

// Tidal Power Plant
const tidal = L.divIcon({
  html: "🌊",
  className: "emoji-icon",
});

export const iconMap = {
  power,
  wind,
  solar,
  biomass,
  hydro,
  coal,
  gas,
  oil,
  geothermal,
  nuclear,
  waste,
  battery,
  tidal,
};
