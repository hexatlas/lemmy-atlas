/*
  LEMMY
*/

interface lemmyInstance {
  id: number;
  label: React.ReactNode;
  baseUrl: string; // make sure the path Symbol "/" is at the end of the URL
  community_id: number;
  default?: boolean;
}

export const lemmyInstances: Array<lemmyInstance> = [
  {
    id: 0,
    label: <i>lib</i>,
    baseUrl: "https://hexbear.net/",
    community_id: 6, // !news@hexbear.net
    default: true,
  },
  {
    id: 1,
    label: "radlib",
    baseUrl: "https://lemmy.ml/",
    community_id: 14788, // !worldnews@lemmy.ml
    default: false,
  },
  {
    id: 2,
    label: "tankie",
    baseUrl: "https://lemmygrad.ml/",
    community_id: 109, // !worldnews@lemmygrad.ml
    default: false,
  },
];

export const communityTypes: Array<string> = ["All", "Local", "Global"]; // ToDo

export const locationTypes: Array<string> = [
  "Country",
  "AdministrativeRegion",
  "Combined",
];

export const sortTypes: Array<string> = [
  "Active",
  "New",
  "Hot",
  "Controversial",
  "TopDay",
  "TopWeek",
  "TopMonth",
  "TopYear",
  "TopAll",
  "MostComments",
  "NewComments",
  "TopHour",
  "TopSixHour",
  "TopTwelveHour",
  "TopThreeMonths",
  "TopSixMonths",
  "TopNineMonths",
  "Old",
  "Scaled",
];

/*
  DATA
*/

export interface dataSource {
  id: number;
  label: React.ReactNode;
  baseUrl: string; // make sure the path Symbol "/" is at the end of the URL
  default?: boolean;
}

export const dataSources: Array<dataSource> = [
  {
    id: 0,
    label: "imf.org",
    baseUrl: "https://www.imf.org/external/datamapper/api/v1/",
    default: true,
  },
  {
    id: 1,
    label: "ilostat.ilo.org",
    baseUrl: "https://ilostat.ilo.org/resources/sdmx-tools/",
    default: false,
  },
  {
    id: 2,
    label: "wto.org",
    baseUrl: "https://apiportal.wto.org/apis/",
    default: false,
  },
  {
    id: 3,
    label: "comtradeplus.un.org",
    baseUrl: "https://comtradeplus.un.org/",
    default: false,
  },
];

/*
  MAP LAYERS
*/

interface mapLayer {
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  minZoom?: number;
  checked?: boolean;
  opacity?: number;
}

export const baseLayers: Array<mapLayer> = [
  {
    name: "ESRI.WorldImagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 20,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  {
    name: "ESRI.WorldTopoMap",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 20,
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  },
  {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    maxZoom: 20,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
  {
    name: "OPNVKarte",
    url: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
    maxZoom: 20,
    attribution:
      'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "OpenStreetMap.Mapnik",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    checked: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Night",
    url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/""/GoogleMapsCompatible_Level{maxZoom}/{z}/{y}/{x}.jpg',
    attribution:
      'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
    maxZoom: 8,
    minZoom: 1,
  },
];

export const overlayLayers: Array<mapLayer> = [
  {
    name: "Clouds",
    checked: true,
    url: `http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${
      import.meta.env.VITE_OPENWEATHER_API_KEY
    }`,
    minZoom: 0,
    maxZoom: 6,
    attribution:
      'Cloud data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    opacity: 0.8,
  },
  {
    name: "OpenRailWayMap",
    checked: false,
    url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
  {
    name: "OpenSeaMap",
    checked: false,
    url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
    opacity: 0.8,
  },
  {
    name: "OpenFireMap",
    checked: false,
    url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
    maxZoom: 19,
    minZoom: 0,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
  {
    name: "SafeCast",
    checked: false,
    url: "https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png",
    maxZoom: 16,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://blog.safecast.org/about/">SafeCast</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
];

/*
  LOCATION - Region Groupings for API Calls (e.g. imf.org)
*/

export const advancedEconomies = [
  "AND",
  "AUS",
  "AUT",
  "BEL",
  "CAN",
  "HRV",
  "CYP",
  "CZE",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "HKG",
  "ISL",
  "IRL",
  "ISR",
  "ITA",
  "JPN",
  "KOR",
  "LVA",
  "LTU",
  "LUX",
  "MAC",
  "MLT",
  "NLD",
  "NZL",
  "NOR",
  "PRT",
  "PRI",
  "SMR",
  "SGP",
  "SVK",
  "SVN",
  "ESP",
  "SWE",
  "CHE",
  "TWN",
  "GBR",
  "USA",
];

export const euroArea = [
  "AUT",
  "BEL",
  "HRV",
  "CYP",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "IRL",
  "ITA",
  "LVA",
  "LTU",
  "LUX",
  "MLT",
  "NLD",
  "PRT",
  "SVK",
  "SVN",
  "ESP",
];

export const majorAdvancedEconomies = [
  "CAN",
  "FRA",
  "DEU",
  "ITA",
  "JPN",
  "GBR",
  "USA",
];

export const otherAdvancedEconomies = advancedEconomies.filter(
  (country) =>
    !majorAdvancedEconomies.includes(country) && !euroArea.includes(country)
);

export const europeanUnion = [
  "AUT",
  "BEL",
  "BGR",
  "HRV",
  "CYP",
  "CZE",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "HUN",
  "IRL",
  "ITA",
  "LVA",
  "LTU",
  "LUX",
  "MLT",
  "NLD",
  "POL",
  "PRT",
  "ROU",
  "SVK",
  "SVN",
  "ESP",
  "SWE",
];

export const asean5 = ["IDN", "MYS", "PHL", "SGP", "THA"];

export const emergingAndDevelopingEconomies = [
  "AFG",
  "ALB",
  "DZA",
  "AGO",
  "ATG",
  "ARG",
  "ARM",
  "ABW",
  "AZE",
  "BHS",
  "BHR",
  "BGD",
  "BRB",
  "BLR",
  "BLZ",
  "BEN",
  "BTN",
  "BOL",
  "BIH",
  "BWA",
  "BRA",
  "BRN",
  "BGR",
  "BFA",
  "BDI",
  "CPV",
  "KHM",
  "CMR",
  "CAF",
  "TCD",
  "CHL",
  "CHN",
  "COL",
  "COM",
  "COD",
  "COG",
  "CRI",
  "CIV",
  "DJI",
  "DMA",
  "DOM",
  "ECU",
  "EGY",
  "SLV",
  "GNQ",
  "ERI",
  "SWZ",
  "ETH",
  "FJI",
  "GAB",
  "GMB",
  "GEO",
  "GHA",
  "GRD",
  "GTM",
  "GIN",
  "GNB",
  "GUY",
  "HTI",
  "HND",
  "HUN",
  "IND",
  "IDN",
  "IRN",
  "IRQ",
  "JAM",
  "JOR",
  "KAZ",
  "KEN",
  "KIR",
  "XKX",
  "KWT",
  "KGZ",
  "LAO",
  "LBN",
  "LSO",
  "LBR",
  "LBY",
  "MDG",
  "MWI",
  "MYS",
  "MDV",
  "MLI",
  "MHL",
  "MRT",
  "MUS",
  "MEX",
  "FSM",
  "MDA",
  "MNG",
  "MNE",
  "MAR",
  "MOZ",
  "MMR",
  "NAM",
  "NRU",
  "NPL",
  "NIC",
  "NER",
  "NGA",
  "MKD",
  "OMN",
  "PAK",
  "PLW",
  "PAN",
  "PNG",
  "PRY",
  "PER",
  "PHL",
  "POL",
  "QAT",
  "ROU",
  "RUS",
  "RWA",
  "WSM",
  "STP",
  "SAU",
  "SEN",
  "SRB",
  "SYC",
  "SLE",
  "SLB",
  "SOM",
  "ZAF",
  "SSD",
  "LKA",
  "KNA",
  "LCA",
  "VCT",
  "SDN",
  "SUR",
  "SYR",
  "TJK",
  "TZA",
  "THA",
  "TLS",
  "TGO",
  "TON",
  "TTO",
  "TUN",
  "TUR",
  "TKM",
  "TUV",
  "UGA",
  "UKR",
  "ARE",
  "URY",
  "UZB",
  "VUT",
  "VEN",
  "VNM",
  "PSE",
  "YEM",
  "ZMB",
  "ZWE",
];

export const emergingAndDevelopingAsia = [
  "BGD",
  "BTN",
  "BRN",
  "KHM",
  "CHN",
  "FJI",
  "IND",
  "IDN",
  "KIR",
  "LAO",
  "MYS",
  "MDV",
  "MHL",
  "MMR",
  "NRU",
  "NPL",
  "PLW",
  "PNG",
  "PHL",
  "WSM",
  "SLB",
  "LKA",
  "THA",
  "TLS",
  "TON",
  "TUV",
  "VUT",
  "VNM",
];

export const emergingAndDevelopingEurope = [
  "ALB",
  "BLR",
  "BIH",
  "BGR",
  "HUN",
  "XKX",
  "MDA",
  "MNE",
  "MKD",
  "POL",
  "ROU",
  "RUS",
  "SRB",
  "TUR",
  "UKR",
];

export const latinAmericaAndTheCaribbean = [
  "ATG",
  "ARG",
  "ABW",
  "BHS",
  "BRB",
  "BLZ",
  "BOL",
  "BRA",
  "CHL",
  "COL",
  "CRI",
  "DMA",
  "DOM",
  "ECU",
  "SLV",
  "GRD",
  "GTM",
  "GUY",
  "HTI",
  "HND",
  "JAM",
  "MEX",
  "NIC",
  "PAN",
  "PRY",
  "PER",
  "KNA",
  "LCA",
  "VCT",
  "SUR",
  "TTO",
  "URY",
  "VEN",
];

export const middleEastAndCentralAsia = [
  "AFG",
  "DZA",
  "ARM",
  "AZE",
  "BHR",
  "DJI",
  "EGY",
  "GEO",
  "IRN",
  "IRQ",
  "JOR",
  "KAZ",
  "KWT",
  "KGZ",
  "LBN",
  "LBY",
  "MRT",
  "MAR",
  "OMN",
  "PAK",
  "QAT",
  "SAU",
  "SOM",
  "SDN",
  "SYR",
  "TJK",
  "TUN",
  "TKM",
  "ARE",
  "UZB",
  "PSE",
  "YEM",
];

export const subSaharanAfrica = [
  "AGO",
  "BEN",
  "BWA",
  "BFA",
  "BDI",
  "CPV",
  "CMR",
  "CAF",
  "TCD",
  "COM",
  "COD",
  "COG",
  "CIV",
  "GNQ",
  "ERI",
  "SWZ",
  "ETH",
  "GAB",
  "GMB",
  "GHA",
  "GIN",
  "GNB",
  "LSO",
  "LBR",
  "MDG",
  "MWI",
  "MLI",
  "MRT",
  "MUS",
  "MYT",
  "NAM",
  "NER",
  "NGA",
  "RWA",
  "STP",
  "SEN",
  "SYC",
  "SLE",
  "SOM",
  "ZAF",
  "SSD",
  "TZA",
  "TGO",
  "UGA",
  "ZMB",
  "ZWE",
];
