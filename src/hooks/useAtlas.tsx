// useAtlas.js
import React, {
  useEffect,
  useRef,
  useReducer,
  Reducer,
  useCallback,
} from 'react';
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
  initAtlas,
} from '../reducer/actions';

import {
  AtlasState,
  AtlasAction,
  AtlasInterfaceProps,
  GeographicIdentifier,
  LocationSelection,
} from '../types/atlas.types';

import { useNavigate } from '@tanstack/react-router';
import { getAdministrativeRegionObject } from './useAtlasUtils';

function useAtlas(Route): AtlasInterfaceProps {
  console.count('useAtlas');

  // Routing
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const navGeographicIdentifier = Object.keys(search);
  const navGeographicIdentifierValue = Object.values(search);

  const navAdministrativeRegion = search['id']
    ? getAdministrativeRegionObject('id', search['id'])
    : getAdministrativeRegionObject(
        navGeographicIdentifier[0] as GeographicIdentifier,
        navGeographicIdentifierValue[0] as string | number,
      );

  const navBounds = search['bounds'];

  console.log('useAtlas: navBounds', navBounds);

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

  // useEffect(() => {
  //   if (map && navBounds)
  //     map?.flyToBounds([
  //       [navBounds[0], navBounds[1]],
  //       [navBounds[2], navBounds[3]],
  //     ]);
  // }, [navBounds]);

  useEffect(() => {
    if (isMobile && activeAdministrativeRegion?.country == 'country') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (isMobile && activeAdministrativeRegion?.country !== 'country') {
      window.scrollTo({
        top: (document.getElementById('legend')?.offsetTop ?? 0) * 1.312,
        behavior: 'smooth',
      });
    }
  }, [activeAdministrativeRegion]);

  useEffect(() => {
    navigate({
      // @ts-expect-error it works
      search: () => ({
        [activeGeographicIdentifier]:
          activeAdministrativeRegion[activeGeographicIdentifier],
        bounds: map?.getBounds().toBBoxString(),
        id: activeAdministrativeRegion?.id,
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
    dispatch(initAtlas(initialState));
    navigate({ to: '/', search });
    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs')?.offsetTop,
        behavior: 'smooth',
      });
  }
  const setLegendSizeCallback = useCallback(
    (legendSize) => dispatch(setLegendSize(legendSize)),
    [dispatch],
  );

  const setIsClusteredCallback = useCallback(
    (isClustered) => dispatch(setIsClustered(isClustered)),
    [dispatch],
  );

  const setMapCallback = useCallback(
    (map) => dispatch(setMap(map)),
    [dispatch],
  );

  const setIsOpenAtlasMapInterfaceCallback = useCallback(
    (isOpenAtlasMapInterface) =>
      dispatch(setIsOpenAtlasMapInterface(isOpenAtlasMapInterface)),
    [dispatch],
  );

  const setIsLocationSelectModeCallback = useCallback(
    (isLocationSelectMode) =>
      dispatch(setIsLocationSelectMode(isLocationSelectMode)),
    [dispatch],
  );

  const setActiveLocationSelectionCallback = useCallback(
    (activeLocationSelection) =>
      dispatch(setActiveLocationSelection(activeLocationSelection)),
    [dispatch],
  );

  const setNominatimCallback = useCallback(
    (nominatim) => dispatch(setNominatim(nominatim)),
    [dispatch],
  );

  const setActiveGeographicIdentifierCallback = useCallback(
    (activeGeographicIdentifier) =>
      dispatch(setActiveGeographicIdentifier(activeGeographicIdentifier)),
    [dispatch],
  );

  const setActiveAdministrativeRegionCallback = useCallback(
    (activeAdministrativeRegion) =>
      dispatch(setActiveAdministrativeRegion(activeAdministrativeRegion)),
    [dispatch],
  );

  const setAdministrativeRegionClickHistoryArrayCallback = useCallback(
    (administrativeRegionClickHistoryArray) =>
      dispatch(
        setAdministrativeRegionClickHistoryArray(
          administrativeRegionClickHistoryArray,
        ),
      ),
    [dispatch],
  );

  return {
    isMobile,
    resetAtlas,
    sideBarRef,
    legendSize,
    setLegendSize: setLegendSizeCallback,
    isClustered,
    setIsClustered: setIsClusteredCallback,
    map,
    setMap: setMapCallback,
    isOpenAtlasMapInterface,
    setIsOpenAtlasMapInterface: setIsOpenAtlasMapInterfaceCallback,
    isLocationSelectMode,
    setIsLocationSelectMode: setIsLocationSelectModeCallback,
    activeLocationSelection,
    setActiveLocationSelection: setActiveLocationSelectionCallback,
    nominatim,
    setNominatim: setNominatimCallback,
    activeGeographicIdentifier,
    setActiveGeographicIdentifier: setActiveGeographicIdentifierCallback,
    activeAdministrativeRegion,
    setActiveAdministrativeRegion: setActiveAdministrativeRegionCallback,
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray:
      setAdministrativeRegionClickHistoryArrayCallback,
  };
}
export default useAtlas;
