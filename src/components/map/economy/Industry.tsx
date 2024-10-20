import L from "leaflet";

/*
  INDUSTRIAL INFRASTRUCTURE
*/

const defaultIcon = L.divIcon({
  html: "🏭",
  className: "emoji-icon emoji-category",
});

const oil = L.divIcon({
  html: "🛢️",
  className: "emoji-icon",
});

// Grinding Mill
const grindingMill = L.divIcon({
  html: "⚙️",
  className: "emoji-icon",
});

// Factory
const factory = L.divIcon({
  html: "🏭",
  className: "emoji-icon",
});

// Wellsite
const wellsite = L.divIcon({
  html: "🛢️",
  className: "emoji-icon",
});

// Gas
const gas = L.divIcon({
  html: "💨",
  className: "emoji-icon",
});

// Depot
const depot = L.divIcon({
  html: "🚚",
  className: "emoji-icon",
});

// Scrap Yard
const scrapYard = L.divIcon({
  html: "🗑️",
  className: "emoji-icon",
});

// Warehouse
const warehouse = L.divIcon({
  html: "🏢",
  className: "emoji-icon",
});

// Brickyard
const brickyard = L.divIcon({
  html: "🧱",
  className: "emoji-icon",
});

// Well Cluster (Deprecated)
const wellCluster = L.divIcon({
  html: "🔗",
  className: "emoji-icon",
});

// Port
const port = L.divIcon({
  html: "⚓",
  className: "emoji-icon",
});

// Mine
const mine = L.divIcon({
  html: "⛏️",
  className: "emoji-icon",
});

// Sawmill
const sawmill = L.divIcon({
  html: "🪚",
  className: "emoji-icon",
});

// Cooling Station
const cooling = L.divIcon({
  html: "❄️",
  className: "emoji-icon",
});

// Slaughterhouse
const slaughterhouse = L.divIcon({
  html: "🥩",
  className: "emoji-icon",
});

// Communication
const communication = L.divIcon({
  html: "📡",
  className: "emoji-icon",
});

// Distributor
const distributor = L.divIcon({
  html: "📦",
  className: "emoji-icon",
});

// Agriculture
const agriculture = L.divIcon({
  html: "🌾",
  className: "emoji-icon",
});

// Timber
const timber = L.divIcon({
  html: "🌲",
  className: "emoji-icon",
});

// Heating Station
const heatingStation = L.divIcon({
  html: "🔥",
  className: "emoji-icon",
});

// Shipyard
const shipyard = L.divIcon({
  html: "🛳️",
  className: "emoji-icon",
});

// Concrete Plant
const concretePlant = L.divIcon({
  html: "🏗️",
  className: "emoji-icon",
});

// Machine Shop
const machineShop = L.divIcon({
  html: "🔧",
  className: "emoji-icon",
});

// Storage
const storage = L.divIcon({
  html: "📦",
  className: "emoji-icon",
});

// Auto Wrecker
const autoWrecker = L.divIcon({
  html: "🚗",
  className: "emoji-icon",
});

// Water
const water = L.divIcon({
  html: "💧",
  className: "emoji-icon",
});

// Fracking
const fracking = L.divIcon({
  html: "⛽",
  className: "emoji-icon",
});

// Brickworks
const brickworks = L.divIcon({
  html: "🧱",
  className: "emoji-icon",
});

// Metal Processing
const metalProcessing = L.divIcon({
  html: "🔩",
  className: "emoji-icon",
});

// Refinery
const refinery = L.divIcon({
  html: "🏭",
  className: "emoji-icon",
});

// Brewery
const brewery = L.divIcon({
  html: "🍺",
  className: "emoji-icon",
});

// Manufacturing
const manufacturing = L.divIcon({
  html: "🏭",
  className: "emoji-icon",
});

// Bakery
const bakery = L.divIcon({
  html: "🍞",
  className: "emoji-icon",
});

// Chemical
const chemical = L.divIcon({
  html: "⚗️",
  className: "emoji-icon",
});

// Natural Gas
const naturalGas = L.divIcon({
  html: "🔥",
  className: "emoji-icon",
});

// Electrical
const electrical = L.divIcon({
  html: "⚡",
  className: "emoji-icon",
});

// Logistics
const logistics = L.divIcon({
  html: "🚛",
  className: "emoji-icon",
});

export const iconMap = {
  defaultIcon,
  oil,
  grindingMill,
  factory,
  wellsite,
  gas,
  depot,
  scrapYard,
  warehouse,
  brickyard,
  wellCluster,
  port,
  mine,
  sawmill,
  cooling,
  slaughterhouse,
  communication,
  distributor,
  agriculture,
  timber,
  heatingStation,
  shipyard,
  concretePlant,
  machineShop,
  storage,
  autoWrecker,
  water,
  fracking,
  brickworks,
  metalProcessing,
  refinery,
  brewery,
  manufacturing,
  bakery,
  chemical,
  naturalGas,
  electrical,
  logistics,
};
