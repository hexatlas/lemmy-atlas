import React, { useEffect, useState, useRef } from 'react';

import '../css/Atlas.scss';

// Import customHook
import { useStateStorage } from '../hooks/useAtlasUtils';

// Types
import {
  geographicIdentifiers,
  AdministrativeRegionObject,
  GeographicIdentifier,
  AtlasInterfaceProps,
  LocationSelection,
  NominatimResponse,
} from '../types/atlas.types';

import L from 'leaflet';

const defaultAdministrativeRegionObject: AdministrativeRegionObject = {
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

function useAtlas(): AtlasInterfaceProps {
  const sideBarRef = useRef<HTMLInputElement>(null);

  /*
    useStates
  */

  // DEVICE
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [legendSize, setLegendSize] = useState<number>(
    // eslint-disable-next-line no-loss-of-precision
    1.6180339887498948482 ^ 512,
  );

  // UI STATES

  const [isOpenAtlasMapInterface, setIsOpenAtlasMapInterface] =
    useState<boolean>(!(window.innerWidth < 768));

  const [isLocationSelectMode, setIsLocationSelectMode] =
    useStateStorage<boolean>('isLocationSelectMode', false);

  const [isClustered, setIsClustered] = useStateStorage<boolean>(
    'isClustered',
    true,
  );

  /*
      useStates
  */

  // LOCATION
  const [map, setMap] = useState<L.Map | null>(null);

  const [nominatim, setNominatim] = useState<NominatimResponse>();
  const [
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,
  ] = useState<LocationSelection[]>([]);

  const [activeAdministrativeRegion, setActiveAdministrativeRegion] =
    useStateStorage<AdministrativeRegionObject>(
      'activeAdministrativeRegion',
      defaultAdministrativeRegionObject,
    );

  const [activeGeographicIdentifier, setActiveGeographicIdentifier] =
    useStateStorage<GeographicIdentifier>(
      'activeGeographicIdentifier',
      geographicIdentifiers[1],
    ); // Default: Country Sort

  const [locationQuery, setLocationQuery] = useStateStorage<string>(
    'locationQuery',
    '',
  );

  const [activeLocationSelection, setActiveLocationSelection] = useStateStorage<
    LocationSelection[]
  >('activeLocationSelection', []);

  /*
      useEffects
  */
  useEffect(() => {
    if (isMobile && activeAdministrativeRegion.country === 'country') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (isMobile && activeAdministrativeRegion.country !== 'country') {
      window.scrollTo({
        top: (document.getElementById('atlas-tabs')?.offsetTop ?? 0) * 1.312,
        behavior: 'smooth',
      });
    }
  }, [activeAdministrativeRegion]);

  useEffect(() => {
    if (isMobile) {
      setIsOpenAtlasMapInterface(false);
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
    setAdministrativeRegionClickHistoryArray([
      selection,
      ...administrativeRegionClickHistoryArray,
    ]);

    if (isLocationSelectMode) {
      setActiveLocationSelection([selection, ...activeLocationSelection]);
    }
  }, [activeAdministrativeRegion, activeGeographicIdentifier, nominatim]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  /*
      FUNCTIONS
  */

  // Handle Resize Legend
  const handleResize = () => {
    setTimeout(() => map && map.invalidateSize(), 300);
    setIsMobile(window.innerWidth < 768);
  };

  // Reset Atlas
  function resetAtlas() {
    setActiveLocationSelection([]);
    setAdministrativeRegionClickHistoryArray([]);
    setActiveAdministrativeRegion(defaultAdministrativeRegionObject);
    setActiveGeographicIdentifier(geographicIdentifiers[1]); // Default: Country Sort
    setLocationQuery('');
    setIsOpenAtlasMapInterface(!isMobile);

    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs')?.offsetTop,
        behavior: 'smooth',
      });
  }

  return {
    // Util
    isMobile,
    resetAtlas,
    sideBarRef,

    legendSize,
    setLegendSize,

    isClustered,
    setIsClustered,

    // Location
    map,
    setMap,

    isOpenAtlasMapInterface,
    setIsOpenAtlasMapInterface,

    isLocationSelectMode,
    setIsLocationSelectMode,

    activeLocationSelection,
    setActiveLocationSelection,

    nominatim,
    setNominatim,

    activeGeographicIdentifier,
    setActiveGeographicIdentifier,

    activeAdministrativeRegion,
    setActiveAdministrativeRegion,

    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,

    locationQuery,
    setLocationQuery,
  };
}

export default useAtlas;
