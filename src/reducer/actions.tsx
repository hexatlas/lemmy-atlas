// actions.js
export const SET_IS_MOBILE = 'SET_IS_MOBILE';
export const SET_LEGEND_SIZE = 'SET_LEGEND_SIZE';
export const SET_IS_OPEN_ATLAS_MAP_INTERFACE =
  'SET_IS_OPEN_ATLAS_MAP_INTERFACE';
export const SET_IS_LOCATION_SELECT_MODE = 'SET_IS_LOCATION_SELECT_MODE';
export const SET_IS_CLUSTERED = 'SET_IS_CLUSTERED';
export const SET_MAP = 'SET_MAP';
export const SET_NOMINATIM = 'SET_NOMINATIM';
export const SET_ADMINISTRATIVE_REGION_CLICK_HISTORY_ARRAY =
  'SET_ADMINISTRATIVE_REGION_CLICK_HISTORY_ARRAY';
export const SET_ACTIVE_ADMINISTRATIVE_REGION =
  'SET_ACTIVE_ADMINISTRATIVE_REGION';
export const SET_ACTIVE_GEOGRAPHIC_IDENTIFIER =
  'SET_ACTIVE_GEOGRAPHIC_IDENTIFIER';
export const SET_ACTIVE_LOCATION_SELECTION = 'SET_ACTIVE_LOCATION_SELECTION';

// Action creators
export function setIsMobile(isMobile) {
  return { type: SET_IS_MOBILE, payload: isMobile };
}

export function setLegendSize(legendSize) {
  return { type: SET_LEGEND_SIZE, payload: legendSize };
}

export function setIsOpenAtlasMapInterface(isOpenAtlasMapInterface) {
  return {
    type: SET_IS_OPEN_ATLAS_MAP_INTERFACE,
    payload: isOpenAtlasMapInterface,
  };
}

export function setIsLocationSelectMode(isLocationSelectMode) {
  return { type: SET_IS_LOCATION_SELECT_MODE, payload: isLocationSelectMode };
}

export function setIsClustered(isClustered) {
  return { type: SET_IS_CLUSTERED, payload: isClustered };
}

export function setMap(map) {
  return { type: SET_MAP, payload: map };
}

export function setNominatim(nominatim) {
  return { type: SET_NOMINATIM, payload: nominatim };
}

export function setAdministrativeRegionClickHistoryArray(
  administrativeRegionClickHistoryArray,
) {
  return {
    type: SET_ADMINISTRATIVE_REGION_CLICK_HISTORY_ARRAY,
    payload: administrativeRegionClickHistoryArray,
  };
}

export function setActiveAdministrativeRegion(activeAdministrativeRegion) {
  return {
    type: SET_ACTIVE_ADMINISTRATIVE_REGION,
    payload: activeAdministrativeRegion,
  };
}

export function setActiveGeographicIdentifier(activeGeographicIdentifier) {
  return {
    type: SET_ACTIVE_GEOGRAPHIC_IDENTIFIER,
    payload: activeGeographicIdentifier,
  };
}

export function setActiveLocationSelection(activeLocationSelection) {
  return {
    type: SET_ACTIVE_LOCATION_SELECTION,
    payload: activeLocationSelection,
  };
}
