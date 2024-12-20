export interface MapLayer {
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  minZoom?: number;
  checked?: boolean;
  opacity?: number;
}

export interface OverpassQuery {
  name: string;
  emoji: string;
  power: string;
  category: string;
  query: (iso3166: string) => string;
}

/*
  LOCATION - Region Groupings for API Calls (e.g. imf.org)
*/

export const advancedEconomies = [
  'AND',
  'AUS',
  'AUT',
  'BEL',
  'CAN',
  'HRV',
  'CYP',
  'CZE',
  'DNK',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'HKG',
  'ISL',
  'IRL',
  'ISR',
  'ITA',
  'JPN',
  'KOR',
  'LVA',
  'LTU',
  'LUX',
  'MAC',
  'MLT',
  'NLD',
  'NZL',
  'NOR',
  'PRT',
  'PRI',
  'SMR',
  'SGP',
  'SVK',
  'SVN',
  'ESP',
  'SWE',
  'CHE',
  'TWN',
  'GBR',
  'USA',
];

export const euroArea = [
  'AUT',
  'BEL',
  'HRV',
  'CYP',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'IRL',
  'ITA',
  'LVA',
  'LTU',
  'LUX',
  'MLT',
  'NLD',
  'PRT',
  'SVK',
  'SVN',
  'ESP',
];

export const majorAdvancedEconomies = [
  'CAN',
  'FRA',
  'DEU',
  'ITA',
  'JPN',
  'GBR',
  'USA',
];

export const otherAdvancedEconomies = advancedEconomies.filter(
  (country) =>
    !majorAdvancedEconomies.includes(country) && !euroArea.includes(country),
);

export const europeanUnion = [
  'AUT',
  'BEL',
  'BGR',
  'HRV',
  'CYP',
  'CZE',
  'DNK',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'HUN',
  'IRL',
  'ITA',
  'LVA',
  'LTU',
  'LUX',
  'MLT',
  'NLD',
  'POL',
  'PRT',
  'ROU',
  'SVK',
  'SVN',
  'ESP',
  'SWE',
];

export const asean5 = ['IDN', 'MYS', 'PHL', 'SGP', 'THA'];

export const emergingAndDevelopingEconomies = [
  'AFG',
  'ALB',
  'DZA',
  'AGO',
  'ATG',
  'ARG',
  'ARM',
  'ABW',
  'AZE',
  'BHS',
  'BHR',
  'BGD',
  'BRB',
  'BLR',
  'BLZ',
  'BEN',
  'BTN',
  'BOL',
  'BIH',
  'BWA',
  'BRA',
  'BRN',
  'BGR',
  'BFA',
  'BDI',
  'CPV',
  'KHM',
  'CMR',
  'CAF',
  'TCD',
  'CHL',
  'CHN',
  'COL',
  'COM',
  'COD',
  'COG',
  'CRI',
  'CIV',
  'DJI',
  'DMA',
  'DOM',
  'ECU',
  'EGY',
  'SLV',
  'GNQ',
  'ERI',
  'SWZ',
  'ETH',
  'FJI',
  'GAB',
  'GMB',
  'GEO',
  'GHA',
  'GRD',
  'GTM',
  'GIN',
  'GNB',
  'GUY',
  'HTI',
  'HND',
  'HUN',
  'IND',
  'IDN',
  'IRN',
  'IRQ',
  'JAM',
  'JOR',
  'KAZ',
  'KEN',
  'KIR',
  'XKX',
  'KWT',
  'KGZ',
  'LAO',
  'LBN',
  'LSO',
  'LBR',
  'LBY',
  'MDG',
  'MWI',
  'MYS',
  'MDV',
  'MLI',
  'MHL',
  'MRT',
  'MUS',
  'MEX',
  'FSM',
  'MDA',
  'MNG',
  'MNE',
  'MAR',
  'MOZ',
  'MMR',
  'NAM',
  'NRU',
  'NPL',
  'NIC',
  'NER',
  'NGA',
  'MKD',
  'OMN',
  'PAK',
  'PLW',
  'PAN',
  'PNG',
  'PRY',
  'PER',
  'PHL',
  'POL',
  'QAT',
  'ROU',
  'RUS',
  'RWA',
  'WSM',
  'STP',
  'SAU',
  'SEN',
  'SRB',
  'SYC',
  'SLE',
  'SLB',
  'SOM',
  'ZAF',
  'SSD',
  'LKA',
  'KNA',
  'LCA',
  'VCT',
  'SDN',
  'SUR',
  'SYR',
  'TJK',
  'TZA',
  'THA',
  'TLS',
  'TGO',
  'TON',
  'TTO',
  'TUN',
  'TUR',
  'TKM',
  'TUV',
  'UGA',
  'UKR',
  'ARE',
  'URY',
  'UZB',
  'VUT',
  'VEN',
  'VNM',
  'PSE',
  'YEM',
  'ZMB',
  'ZWE',
];

export const emergingAndDevelopingAsia = [
  'BGD',
  'BTN',
  'BRN',
  'KHM',
  'CHN',
  'FJI',
  'IND',
  'IDN',
  'KIR',
  'LAO',
  'MYS',
  'MDV',
  'MHL',
  'MMR',
  'NRU',
  'NPL',
  'PLW',
  'PNG',
  'PHL',
  'WSM',
  'SLB',
  'LKA',
  'THA',
  'TLS',
  'TON',
  'TUV',
  'VUT',
  'VNM',
];

export const emergingAndDevelopingEurope = [
  'ALB',
  'BLR',
  'BIH',
  'BGR',
  'HUN',
  'XKX',
  'MDA',
  'MNE',
  'MKD',
  'POL',
  'ROU',
  'RUS',
  'SRB',
  'TUR',
  'UKR',
];

export const latinAmericaAndTheCaribbean = [
  'ATG',
  'ARG',
  'ABW',
  'BHS',
  'BRB',
  'BLZ',
  'BOL',
  'BRA',
  'CHL',
  'COL',
  'CRI',
  'DMA',
  'DOM',
  'ECU',
  'SLV',
  'GRD',
  'GTM',
  'GUY',
  'HTI',
  'HND',
  'JAM',
  'MEX',
  'NIC',
  'PAN',
  'PRY',
  'PER',
  'KNA',
  'LCA',
  'VCT',
  'SUR',
  'TTO',
  'URY',
  'VEN',
];

export const middleEastAndCentralAsia = [
  'AFG',
  'DZA',
  'ARM',
  'AZE',
  'BHR',
  'DJI',
  'EGY',
  'GEO',
  'IRN',
  'IRQ',
  'JOR',
  'KAZ',
  'KWT',
  'KGZ',
  'LBN',
  'LBY',
  'MRT',
  'MAR',
  'OMN',
  'PAK',
  'QAT',
  'SAU',
  'SOM',
  'SDN',
  'SYR',
  'TJK',
  'TUN',
  'TKM',
  'ARE',
  'UZB',
  'PSE',
  'YEM',
];

export const subSaharanAfrica = [
  'AGO',
  'BEN',
  'BWA',
  'BFA',
  'BDI',
  'CPV',
  'CMR',
  'CAF',
  'TCD',
  'COM',
  'COD',
  'COG',
  'CIV',
  'GNQ',
  'ERI',
  'SWZ',
  'ETH',
  'GAB',
  'GMB',
  'GHA',
  'GIN',
  'GNB',
  'LSO',
  'LBR',
  'MDG',
  'MWI',
  'MLI',
  'MRT',
  'MUS',
  'MYT',
  'NAM',
  'NER',
  'NGA',
  'RWA',
  'STP',
  'SEN',
  'SYC',
  'SLE',
  'SOM',
  'ZAF',
  'SSD',
  'TZA',
  'TGO',
  'UGA',
  'ZMB',
  'ZWE',
];
