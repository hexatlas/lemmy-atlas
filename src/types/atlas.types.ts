// Important: Needs to match geoJSON properties with the imported administrativeRegionsData in src/geojson that get's imported in Atlas.tsx

import { ReactNode } from '@tanstack/react-router';

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
  // Util
  isMobile: boolean;
  resetAtlas: () => void;
  sideBarRef: React.RefObject<HTMLInputElement>;

  legendSize: number;
  setLegendSize: (legendSize: number) => void;

  isClustered: boolean;
  setIsClustered: (isClustered: boolean) => void;

  // Location
  map: L.Map | null;
  setMap: (map: L.Map | null) => void;

  isOpenAtlasMapInterface: boolean;
  setIsOpenAtlasMapInterface: (isOpenAtlasMapInterface: boolean) => void;

  isLocationSelectMode: boolean;
  setIsLocationSelectMode: (isLocationSelectMode: boolean) => void;

  nominatim: NominatimResponse | undefined;
  setNominatim: (nominatim: NominatimResponse) => void;

  activeGeographicIdentifier: GeographicIdentifier;
  setActiveGeographicIdentifier: (
    activeGeographicIdentifier: GeographicIdentifier,
  ) => void;

  activeAdministrativeRegion: AdministrativeRegionObject;
  setActiveAdministrativeRegion: (
    activeAdministrativeRegion: AdministrativeRegionObject,
  ) => void;

  administrativeRegionClickHistoryArray: LocationSelection[];
  setAdministrativeRegionClickHistoryArray: (
    administrativeRegionClickHistoryArray: LocationSelection[],
  ) => void;

  activeLocationSelection: LocationSelection[];
  setActiveLocationSelection: (
    activeLocationSelection: LocationSelection[],
  ) => void;

  locationQuery: string;
  setLocationQuery: (locationQuery: string) => void;
}

export interface LocationSelection {
  activeSelection: string | undefined;
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

export interface NominatimResponse {
  features: NominatimFeature[];
}

export interface NominatimFeature {
  properties: { name: string };
}

export interface InformationLemmyProps {
  // Community
  defaultInstance;
  activeLemmyInstance;
  setActiveLemmyInstance;

  activeCommunity;
  setActiveCommunity;

  activeSearchType;
  setActiveSearchType;

  listingTypes;
  activeListingType;
  setActiveListingType;

  sortTypes;
  activeSortType;
  setActiveSortType;
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
  children?: ReactNode;
  index: number;
  iconMap?: {
    [key: string]: L.DivIcon;
  };
  filterKeys?: string[];
  handleMouseEnter: (element: OSMElement) => void;
  handleMouseLeave: (element: OSMElement) => void;
  handleClick: (element: OSMElement) => void;
  activeElement: OSMElement | null;
}

export interface OSMInfoListProps {
  listName: string;
  map: L.Map | null;
  iconMap?: {
    [key: string]: L.DivIcon;
  };
  filterKeys: string[];
  data;
  activeAdministrativeRegion: AdministrativeRegionObject;
}
