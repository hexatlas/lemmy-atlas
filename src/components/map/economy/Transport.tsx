import L from "leaflet";

/*
  POWER PLANTS
*/

const defaultIcon = L.divIcon({
  html: "🚆",
  className: "emoji-icon emoji-category",
});

const lightRail = L.divIcon({
  html: "🚊", // Light Rail
  className: "emoji-icon",
});

const subway = L.divIcon({
  html: "🚈", // Subway
  className: "emoji-icon",
});

const narrowGauge = L.divIcon({
  html: "🚂", // Narrow Gauge
  className: "emoji-icon",
});

const monorail = L.divIcon({
  html: "🚝", // Monorail
  className: "emoji-icon",
});

const preservedRailway = L.divIcon({
  html: "🛤️", // Preserved Railway
  className: "emoji-icon",
});

const funicular = L.divIcon({
  html: "🚡", // Funicular
  className: "emoji-icon",
});

export const iconMap = {
  defaultIcon,
  lightRail,
  subway,
  narrowGauge,
  monorail,
  preservedRailway,
  funicular,
};
