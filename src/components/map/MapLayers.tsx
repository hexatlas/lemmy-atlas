import { MapLayer } from '../../types/map.types';

export const baseLayers: Array<MapLayer> = [
  {
    name: 'CartoDB.Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
  {
    name: 'CartoDB.Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',

    maxZoom: 20,
  },
  {
    name: 'CartoDB.DarkMatter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
  {
    name: 'ESRI.WorldImagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 20,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    name: 'ESRI.WorldTopoMap',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 20,
    attribution:
      'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  },
  {
    name: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    maxZoom: 20,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
  {
    name: 'OPNVKarte',
    url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
    maxZoom: 20,
    attribution:
      'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: 'OpenStreetMap.Mapnik',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    checked: true,
  },
  {
    name: 'Night',
    url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/""/GoogleMapsCompatible_Level{maxZoom}/{z}/{y}/{x}.jpg',
    attribution:
      'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
    maxZoom: 8,
    minZoom: 1,
  },
];

export const overlayLayers: Array<MapLayer> = [
  {
    name: 'Clouds',
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
    name: 'Precipitation',
    checked: true,
    url: `http://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${
      import.meta.env.VITE_OPENWEATHER_API_KEY
    }`,
    minZoom: 0,
    maxZoom: 6,
    attribution:
      'Cloud data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    opacity: 0.8,
  },
  {
    name: 'OpenRailWayMap',
    checked: false,
    url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
  {
    name: 'OpenSeaMap',
    checked: false,
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
    opacity: 0.8,
  },
  {
    name: 'OpenFireMap',
    checked: false,
    url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
    maxZoom: 19,
    minZoom: 0,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
  {
    name: 'SafeCast',
    checked: false,
    url: 'https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png',
    maxZoom: 16,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://blog.safecast.org/about/">SafeCast</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    opacity: 0.8,
  },
];
