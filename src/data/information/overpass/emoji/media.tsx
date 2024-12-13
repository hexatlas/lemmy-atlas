import L from "leaflet";

/*
  INFORMATION/MEDIA INFRASTRUCTURE
*/

const defaultIcon = L.divIcon({
  html: "📰",
  className: "emoji-icon emoji-category",
});

// Print Media
const printMedia = L.divIcon({
  html: "📰",
  className: "emoji-icon",
});

// Radio Station
const radioStation = L.divIcon({
  html: "📻",
  className: "emoji-icon",
});

// TV Station
const tvStation = L.divIcon({
  html: "📺",
  className: "emoji-icon",
});

// Telecommunication Tower
const telecomTower = L.divIcon({
  html: "📡",
  className: "emoji-icon",
});

// Fiber Optic Cable
const fiberOpticCable = L.divIcon({
  html: "📶",
  className: "emoji-icon",
});

// Data Center
const dataCenter = L.divIcon({
  html: "💻",
  className: "emoji-icon",
});

// Internet Provider
const internetProvider = L.divIcon({
  html: "🌐",
  className: "emoji-icon",
});

// News Agency
const newsAgency = L.divIcon({
  html: "🗞️",
  className: "emoji-icon",
});

// Podcast Studio
const podcastStudio = L.divIcon({
  html: "🎙️",
  className: "emoji-icon",
});

// Streaming Service
const streamingService = L.divIcon({
  html: "📹",
  className: "emoji-icon",
});

// Bulletin Board
const bulletinBoard = L.divIcon({
  html: "📌",
  className: "emoji-icon",
});

// Social Media
const socialMedia = L.divIcon({
  html: "💬",
  className: "emoji-icon",
});

export const iconMap = {
  defaultIcon,
  printMedia,
  radioStation,
  tvStation,
  telecomTower,
  fiberOpticCable,
  dataCenter,
  internetProvider,
  newsAgency,
  podcastStudio,
  streamingService,
  bulletinBoard,
  socialMedia,
};
