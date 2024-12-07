// Important: Needs to match geoJSON properties with the imported administrativeRegionsData in src/geojson that get's imported in Atlas.tsx

export type GeographicIdentifier =
  | 'name'
  | 'country'
  | 'emoji'
  | 'image'
  | 'alpha-2'
  | 'alpha-3'
  | 'sub-region'
  | 'intermediate-region'
  | 'region'
  | 'unicode'
  | 'country-code'
  | 'sub-region-code'
  | 'intermediate-region-code'
  | 'region-code'
  | 'iso_3166-2'
  | 'ISO3166-1-Alpha-3'
  | 'code'
  | 'id';

export const geographicIdentifiers: Array<GeographicIdentifier> = [
  'name',
  'country',
  'emoji',
  'image',
  'alpha-2',
  'alpha-3',
  'sub-region',
  'intermediate-region',
  'region',
  'unicode',
  'country-code',
  'sub-region-code',
  'intermediate-region-code',
  'region-code',
  'iso_3166-2',
  'ISO3166-1-Alpha-3',
  'code',
  'id',
];

export interface AdministrativeRegionObject {
  name: string;
  country: string;
  emoji: string;
  image?: string;
  'alpha-2': string;
  'alpha-3': string;
  'sub-region': string;
  'intermediate-region': string;
  region: string;
  unicode: string;
  'country-code': string;
  'sub-region-code': string;
  'intermediate-region-code': string;
  'region-code': string;
  'iso_3166-2': string;
  'ISO3166-1-Alpha-3': string;
  code: string;
  id: string;
}

export interface AtlasInterfaceProps {
  // Util props
  isMobile: boolean;
  resetAtlas: () => void;
  legendSize: number;
  setLegendSize: (size: number) => void;
  sideBarRef: any;

  // Map related
  map: L.Map | null;
  isOpenAtlasMapInterface: boolean;
  setIsOpenAtlasMapInterface: (isOpen: boolean) => void;

  // Location related
  isLocationSelectMode: boolean;
  setIsLocationSelectMode: (mode: boolean) => void;
  activeGeographicIdentifier: GeographicIdentifier;
  setActiveGeographicIdentifier: (type: GeographicIdentifier) => void;
  activeAdministrativeRegion: AdministrativeRegionObject;
  setActiveAdministrativeRegion: (region: AdministrativeRegionObject) => void;
}

export interface LocationSelection {
  activeSelection: string;
  activeGeographicIdentifier: GeographicIdentifier;
  activeAdministrativeRegion: AdministrativeRegionObject;
}

export interface MapState {
  activeAdministrativeRegion: AdministrativeRegionObject;
  activeGeographicIdentifier: GeographicIdentifier;
  isClustered: boolean;
  setActiveAdministrativeRegion: (region: AdministrativeRegionObject) => void;
  setActiveGeographicIdentifier: (type: GeographicIdentifier) => void;
  setIsClustered: (clustered: boolean) => void;
}

export interface OSMElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  bounds?: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
  tags: {
    [key: string]: string;
  };
}

export interface OSMInfoCardProps {
  element: OSMElement;
  index: number;
  iconMap?: Record<string, string>;
  filterKeys?: string[];
  handleMouseEnter: (element: OSMElement) => void;
  handleMouseLeave: (element: OSMElement) => void;
  handleClick: (element: OSMElement) => void;
  activeElement: OSMElement | null;
}
