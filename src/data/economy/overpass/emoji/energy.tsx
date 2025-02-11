import L from "leaflet";

/*
  POWER PLANTS
*/

const defaultIcon = L.divIcon({
  html: "⚡",
  className: "emoji-icon emoji-category",
});

const power = L.divIcon({
  html: "⚡",
  className: "emoji-icon",
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
  defaultIcon,
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
