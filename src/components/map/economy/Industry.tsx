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
const grinding_mill = L.divIcon({
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
const scrap_yard = L.divIcon({
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

// Distributor
const distribution = L.divIcon({
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
const heating_station = L.divIcon({
  html: "🔥",
  className: "emoji-icon",
});

// Shipyard
const shipyard = L.divIcon({
  html: "🛳️",
  className: "emoji-icon",
});

// Concrete Plant
const concrete_plant = L.divIcon({
  html: "🏗️",
  className: "emoji-icon",
});

// Machine Shop
const machine_shop = L.divIcon({
  html: "🔧",
  className: "emoji-icon",
});

// Machinery
const machinery = L.divIcon({
  html: "🔧",
  className: "emoji-icon",
});

// Storage
const storage = L.divIcon({
  html: "📦",
  className: "emoji-icon",
});

// Auto Wrecker
const auto_wrecker = L.divIcon({
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
const metal_processing = L.divIcon({
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
const natural_gas = L.divIcon({
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

const steelmaking = L.divIcon({
  html: "🔥",
  className: "emoji-icon",
});

// Terminal
const terminal = L.divIcon({
  html: "🚢",
  className: "emoji-icon",
});

// Consumer Goods
const consumer_goods = L.divIcon({
  html: "🛍️",
  className: "emoji-icon",
});

// Intermodal Freight Terminal
const intermodal_freight_terminal = L.divIcon({
  html: "🚛",
  className: "emoji-icon",
});

// Automotive Industry
const automotive_industry = L.divIcon({
  html: "🚗",
  className: "emoji-icon",
});

// Automotive
const automotive = L.divIcon({
  html: "🚗",
  className: "emoji-icon",
});

// Paper Mill
const paper_mill = L.divIcon({
  html: "📄",
  className: "emoji-icon",
});

// Telecommunication
const telecommunication = L.divIcon({
  html: "📡",
  className: "emoji-icon",
});

// gas_storage
const gas_storage = L.divIcon({
  html: "⛽️",
  className: "emoji-icon",
});

// furniture
const furniture = L.divIcon({
  html: "🛋️",
  className: "emoji-icon",
});

// mill
const mill = L.divIcon({
  html: "🌾",
  className: "emoji-icon",
});

// petroleum_terminal
const petroleum_terminal = L.divIcon({
  html: "🚢",
  className: "emoji-icon",
});

// Sand Pit
const sand_pit = L.divIcon({
  html: "🏖️",
  className: "emoji-icon",
});

// Aerospace
const aerospace = L.divIcon({
  html: "🚀",
  className: "emoji-icon",
});

// Water Works
const water_works = L.divIcon({
  html: "💧",
  className: "emoji-icon",
});

// Wastewater Plant
const wastewater_plant = L.divIcon({
  html: "🏭",
  className: "emoji-icon",
});

// Agricultural
const agricultural = L.divIcon({
  html: "🌾",
  className: "emoji-icon",
});

// Oil Depot
const oil_depot = L.divIcon({
  html: "🛢️",
  className: "emoji-icon",
});

// Construction
const construction = L.divIcon({
  html: "🚧",
  className: "emoji-icon",
});

// Woodworking
const woodworking = L.divIcon({
  html: "🪵",
  className: "emoji-icon",
});

// Fuel Depot
const fuel_depot = L.divIcon({
  html: "⛽",
  className: "emoji-icon",
});

// Transport
const transport = L.divIcon({
  html: "🚚",
  className: "emoji-icon",
});

// Mineral Processing
const mineral_processing = L.divIcon({
  html: "⛏️",
  className: "emoji-icon",
});

// Agrifood
const agrifood = L.divIcon({
  html: "🥦",
  className: "emoji-icon",
});

// Pharmaceuticals
const pharmaceuticals = L.divIcon({
  html: "💊",
  className: "emoji-icon",
});

// Cement Plant
const cement_plant = L.divIcon({
  html: "🏭",
  className: "emoji-icon",
});

// Storage Centre
const storage_centre = L.divIcon({
  html: "📦",
  className: "emoji-icon",
});

// Grain Storage Centre
const grain_storage_centre = L.divIcon({
  html: "🌾",
  className: "emoji-icon",
});

// Quarry
const quarry = L.divIcon({
  html: "⛏️",
  className: "emoji-icon",
});

// Construction Company
const construction_company = L.divIcon({
  html: "🏗️",
  className: "emoji-icon",
});

// Power
const power = L.divIcon({
  html: "⚡",
  className: "emoji-icon",
});

// Water Management
const water_management = L.divIcon({
  html: "💧",
  className: "emoji-icon",
});

export const iconMap = {
  cement_plant,
  storage_centre,
  grain_storage_centre,
  quarry,
  construction_company,
  power,
  water_management,
  woodworking,
  fuel_depot,
  transport,
  mineral_processing,
  agrifood,
  pharmaceuticals,
  sand_pit,
  aerospace,
  water_works,
  wastewater_plant,
  agricultural,
  oil_depot,
  construction,
  gas_storage,
  furniture,
  mill,
  petroleum_terminal,
  consumer_goods,
  intermodal_freight_terminal,
  automotive_industry,
  automotive,
  paper_mill,
  telecommunication,
  defaultIcon,
  oil,
  grinding_mill,
  factory,
  wellsite,
  gas,
  depot,
  scrap_yard,
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
  distribution,
  agriculture,
  timber,
  heating_station,
  shipyard,
  concrete_plant,
  machinery,
  machine_shop,
  storage,
  auto_wrecker,
  water,
  fracking,
  brickworks,
  metal_processing,
  refinery,
  brewery,
  manufacturing,
  bakery,
  chemical,
  natural_gas,
  electrical,
  logistics,
  steelmaking,
  terminal,
};
