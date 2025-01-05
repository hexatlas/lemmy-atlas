// reducer.js
import { AdministrativeRegionObject, AtlasSate } from '../types/atlas.types';
import {
  SET_IS_MOBILE,
  SET_LEGEND_SIZE,
  SET_IS_OPEN_ATLAS_MAP_INTERFACE,
  SET_IS_LOCATION_SELECT_MODE,
  SET_IS_CLUSTERED,
  SET_MAP,
  SET_NOMINATIM,
  SET_ADMINISTRATIVE_REGION_CLICK_HISTORY_ARRAY,
  SET_ACTIVE_ADMINISTRATIVE_REGION,
  SET_ACTIVE_GEOGRAPHIC_IDENTIFIER,
  SET_ACTIVE_LOCATION_SELECTION,
} from './actions';

export const defaultAdministrativeRegionObject: AdministrativeRegionObject = {
  // START - Do not change as theres a lot of If(activeAdministrativeRegion.country === "country") that depends on this
  country: 'country',
  name: 'name',
  'intermediate-region': 'intermediate-region',
  'sub-region': 'sub-region',
  region: 'region',
  // END
  emoji: '',
  image: '',
  'alpha-2': '',
  'alpha-3': '',
  unicode: '',
  'country-code': '',
  'sub-region-code': '',
  'intermediate-region-code': '',
  'region-code': '',
  'iso_3166-2': '',
  'ISO3166-1-Alpha-3': '',
  code: '',
  id: '',
};

export const initialState: AtlasSate = {
  isMobile: window.innerWidth < 768,
  // eslint-disable-next-line no-loss-of-precision
  legendSize: 1.6180339887498948482 ^ 512,
  isOpenAtlasMapInterface: !(window.innerWidth < 768),
  isLocationSelectMode: false,
  isClustered: true,
  map: null,
  nominatim: undefined,
  administrativeRegionClickHistoryArray: [],
  activeAdministrativeRegion: defaultAdministrativeRegionObject,
  activeGeographicIdentifier: 'country',
  activeLocationSelection: [],
};

export default function atlasReducer(
  state: AtlasSate = initialState,
  action,
): AtlasSate {
  switch (action.type) {
    case SET_IS_MOBILE:
      return { ...state, isMobile: action.payload };

    case SET_LEGEND_SIZE:
      return { ...state, legendSize: action.payload };

    case SET_IS_OPEN_ATLAS_MAP_INTERFACE:
      return { ...state, isOpenAtlasMapInterface: action.payload };

    case SET_IS_LOCATION_SELECT_MODE:
      return { ...state, isLocationSelectMode: action.payload };

    case SET_IS_CLUSTERED:
      return { ...state, isClustered: action.payload };

    case SET_MAP:
      return { ...state, map: action.payload };

    case SET_NOMINATIM:
      return { ...state, nominatim: action.payload };

    case SET_ADMINISTRATIVE_REGION_CLICK_HISTORY_ARRAY:
      return {
        ...state,
        administrativeRegionClickHistoryArray: action.payload,
      };

    case SET_ACTIVE_ADMINISTRATIVE_REGION:
      return { ...state, activeAdministrativeRegion: action.payload };

    case SET_ACTIVE_GEOGRAPHIC_IDENTIFIER:
      return { ...state, activeGeographicIdentifier: action.payload };

    case SET_ACTIVE_LOCATION_SELECTION:
      return { ...state, activeLocationSelection: action.payload };

    default:
      return state;
  }
}
