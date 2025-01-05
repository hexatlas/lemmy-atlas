// useAtlas.js
import React, { useEffect, useRef, useReducer } from 'react';
import atlasReducer from '../reducer/reducer';
import { initialState } from '../reducer/reducer';

import {
  setIsMobile,
  setIsClustered,
  setLegendSize,
  setMap,
  setIsOpenAtlasMapInterface,
  setIsLocationSelectMode,
  setActiveLocationSelection,
  setNominatim,
  setActiveGeographicIdentifier,
  setActiveAdministrativeRegion,
  setAdministrativeRegionClickHistoryArray,
} from '../reducer/actions';

import { AtlasInterfaceProps, LocationSelection } from '../types/atlas.types';
import { defaultAdministrativeRegionObject } from '../reducer/reducer';
import { useNavigate } from '@tanstack/react-router';
import { getAdministrativeRegionObject } from './useAtlasUtils';

function useAtlas(Route): AtlasInterfaceProps {
  // Routing
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const geographicIdentifier = Object.keys(search);
  const query = Object.values(search);

  const navAdministrativeRegion = search['id']
    ? getAdministrativeRegionObject('id', search['id'])
    : getAdministrativeRegionObject(geographicIdentifier[0], query[0]);
  console.log(
    navAdministrativeRegion,
    geographicIdentifier,
    query,
    'Route.useSearch();',
  );

  const sideBarRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(atlasReducer, {
    ...initialState,
    activeAdministrativeRegion: navAdministrativeRegion,
    activeGeographicIdentifier: geographicIdentifier[0],
  });

  const {
    isMobile,
    legendSize,
    isClustered,
    map,
    isOpenAtlasMapInterface,
    isLocationSelectMode,
    activeLocationSelection,
    nominatim,
    activeGeographicIdentifier,
    activeAdministrativeRegion,
    administrativeRegionClickHistoryArray,
  } = state;

  // Handle resize
  const handleResize = () => {
    setTimeout(() => state.map && state.map.invalidateSize(), 300);
    dispatch(setIsMobile(window.innerWidth < 768));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /*
      useEffects
  */
  useEffect(() => {
    if (state.isMobile && activeAdministrativeRegion?.country == 'country') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (state.isMobile && activeAdministrativeRegion?.country !== 'country') {
      window.scrollTo({
        top: (document.getElementById('atlas-legend')?.offsetTop ?? 0) * 1.312,
        behavior: 'smooth',
      });
    }
  }, [state.activeAdministrativeRegion]);

  useEffect(() => {
    navigate({
      search: () => ({
        [activeGeographicIdentifier]:
          activeAdministrativeRegion[activeGeographicIdentifier],
        id: activeAdministrativeRegion.id,
      }),
    });

    if (state.isMobile) {
      dispatch(setIsOpenAtlasMapInterface(false));
    }
    // if (sideBarRef.current) sideBarRef.current.scrollTop = 0;
    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs')?.offsetTop,
        behavior: 'smooth',
      });

    const selection: LocationSelection = {
      activeSelection:
        state.activeAdministrativeRegion[state.activeGeographicIdentifier],
      activeGeographicIdentifier: state.activeGeographicIdentifier,
      activeAdministrativeRegion: state.activeAdministrativeRegion,
    };
    dispatch(
      setAdministrativeRegionClickHistoryArray([
        selection,
        ...state.administrativeRegionClickHistoryArray,
      ]),
    );
    if (state.isLocationSelectMode) {
      dispatch(
        setAdministrativeRegionClickHistoryArray([
          selection,
          ...state.activeLocationSelection,
        ]),
      );
    }
  }, [
    state.activeAdministrativeRegion,
    state.activeGeographicIdentifier,
    state.nominatim,
  ]);

  // resetAtlas function
  function resetAtlas() {
    dispatch(setActiveLocationSelection([]));
    dispatch(setAdministrativeRegionClickHistoryArray([]));
    dispatch(setActiveAdministrativeRegion(defaultAdministrativeRegionObject));
    dispatch(setActiveGeographicIdentifier('country'));
    dispatch(setIsOpenAtlasMapInterface(!state.isMobile));
    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs')?.offsetTop,
        behavior: 'smooth',
      });
  }

  return {
    isMobile,
    resetAtlas,
    sideBarRef,

    legendSize,
    setLegendSize: (legendSize) => dispatch(setLegendSize(legendSize)),

    isClustered,
    setIsClustered: (isClustered) => dispatch(setIsClustered(isClustered)),

    map,
    setMap: (map) => dispatch(setMap(map)),

    isOpenAtlasMapInterface,
    setIsOpenAtlasMapInterface: (isOpenAtlasMapInterface) =>
      dispatch(setIsOpenAtlasMapInterface(isOpenAtlasMapInterface)),

    isLocationSelectMode,
    setIsLocationSelectMode: (isLocationSelectMode) =>
      dispatch(setIsLocationSelectMode(isLocationSelectMode)),

    activeLocationSelection,
    setActiveLocationSelection: (activeLocationSelection) =>
      dispatch(setActiveLocationSelection(activeLocationSelection)),

    nominatim,
    setNominatim: (nominatim) => dispatch(setNominatim(nominatim)),

    activeGeographicIdentifier,
    setActiveGeographicIdentifier: (activeGeographicIdentifier) =>
      dispatch(setActiveGeographicIdentifier(activeGeographicIdentifier)),

    activeAdministrativeRegion,
    setActiveAdministrativeRegion: (activeAdministrativeRegion) =>
      dispatch(setActiveAdministrativeRegion(activeAdministrativeRegion)),

    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray: (
      administrativeRegionClickHistoryArray,
    ) =>
      dispatch(
        setAdministrativeRegionClickHistoryArray(
          administrativeRegionClickHistoryArray,
        ),
      ),
  };
}
export default useAtlas;
