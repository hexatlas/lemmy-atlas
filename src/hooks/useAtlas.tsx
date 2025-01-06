// useAtlas.js
import React, { useEffect, useRef, useReducer, Reducer } from 'react';
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

import {
  AtlasState,
  AtlasAction,
  AtlasInterfaceProps,
  GeographicIdentifier,
  LocationSelection,
} from '../types/atlas.types';
import { defaultAdministrativeRegionObject } from '../reducer/reducer';
import { useNavigate } from '@tanstack/react-router';
import { getAdministrativeRegionObject } from './useAtlasUtils';

function useAtlas(Route): AtlasInterfaceProps {
  // Routing
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const navGeographicIdentifier = Object.keys(search);
  const navGeographicIdentifierValue = Object.values(search);

  const navAdministrativeRegion = search['id']
    ? getAdministrativeRegionObject('id', search['id'])
    : getAdministrativeRegionObject(
        navGeographicIdentifier[0] as GeographicIdentifier,
        navGeographicIdentifierValue[0] as string,
      );

  const sideBarRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer<Reducer<AtlasState, AtlasAction>>(
    atlasReducer,
    {
      ...initialState,
      activeAdministrativeRegion: navAdministrativeRegion,
      activeGeographicIdentifier:
        navGeographicIdentifier[0] as GeographicIdentifier,
    },
  );

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
    setTimeout(() => map && map.invalidateSize(), 300);
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
    if (isMobile && activeAdministrativeRegion?.country == 'country') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (isMobile && activeAdministrativeRegion?.country !== 'country') {
      window.scrollTo({
        top: (document.getElementById('atlas-legend')?.offsetTop ?? 0) * 1.312,
        behavior: 'smooth',
      });
    }
  }, [activeAdministrativeRegion]);

  useEffect(() => {
    navigate({
      search: () => ({
        [activeGeographicIdentifier]:
          activeAdministrativeRegion[activeGeographicIdentifier],
        id: activeAdministrativeRegion.id,
      }),
    });

    if (isMobile) {
      dispatch(setIsOpenAtlasMapInterface(false));
    }
    // if (sideBarRef.current) sideBarRef.current.scrollTop = 0;
    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs')?.offsetTop,
        behavior: 'smooth',
      });

    const selection: LocationSelection = {
      activeSelection: activeAdministrativeRegion[activeGeographicIdentifier],
      activeGeographicIdentifier,
      activeAdministrativeRegion,
    };
    dispatch(
      setAdministrativeRegionClickHistoryArray([
        selection,
        ...administrativeRegionClickHistoryArray,
      ]),
    );
    if (isLocationSelectMode) {
      dispatch(
        setAdministrativeRegionClickHistoryArray([
          selection,
          ...activeLocationSelection,
        ]),
      );
    }
  }, [activeAdministrativeRegion, activeGeographicIdentifier, nominatim]);

  // resetAtlas function
  function resetAtlas() {
    dispatch(setActiveLocationSelection([]));
    dispatch(setAdministrativeRegionClickHistoryArray([]));
    dispatch(setActiveAdministrativeRegion(defaultAdministrativeRegionObject));
    dispatch(setActiveGeographicIdentifier('country'));
    dispatch(setIsOpenAtlasMapInterface(!isMobile));
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
