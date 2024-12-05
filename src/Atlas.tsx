import React, { useEffect, useMemo, useState, useRef } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Components
import AtlasMap from './components/map/Index';
import AtlasLegend from './components/legend/Index';
import AtlasInterface from './AtlasInterface';

// Import customHook
import { useStateStorage } from './hooks/useAtlasUtils';

// Types
import {
  geographicIdentifiers,
  AdministrativeRegionObject,
  GeographicIdentifier,
} from '../src/types/atlas.types';

import L from 'leaflet';

/*

 /$$   /$$                      /$$$$$$    /$$     /$$                    
| $$  | $$                     /$$__  $$  | $$    | $$                    
| $$  | $$  /$$$$$$  /$$   /$$| $$  \ $$ /$$$$$$  | $$  /$$$$$$   /$$$$$$$
| $$$$$$$$ /$$__  $$|  $$ /$$/| $$$$$$$$|_  $$_/  | $$ |____  $$ /$$_____/
| $$__  $$| $$$$$$$$ \  $$$$/ | $$__  $$  | $$    | $$  /$$$$$$$|  $$$$$$ 
| $$  | $$| $$_____/  >$$  $$ | $$  | $$  | $$ /$$| $$ /$$__  $$ \____  $$
| $$  | $$|  $$$$$$$ /$$/\  $$| $$  | $$  |  $$$$/| $$|  $$$$$$$ /$$$$$$$/
|__/  |__/ \_______/|__/  \__/|__/  |__/   \___/  |__/ \_______/|_______/                                                                           
                                                                          
                                                                                                                                                                                                                                                                            
*/

export default function Atlas() {
  const sideBarRef = useRef<HTMLInputElement>(null);
  /*
    useStates
  */
  // DEVICE
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const [legendSize, setLegendSize] = useState<number>(
    1.6180339887498948482 ^ 512,
  );

  // UI STATES

  const [isOpenAtlasMapInterface, setIsOpenAtlasMapInterface] =
    useState<boolean>(!(window.innerWidth < 768));

  const [isLocationSelectMode, setIsLocationSelectMode] =
    useStateStorage<boolean>('isLocationSelectMode', false);

  const [activeLocationSelection, setActiveLocationSelection] = useStateStorage(
    'activeLocationSelection',
    [],
  );

  const [isClustered, setIsClustered] = useStateStorage<boolean>(
    'isClustered',
    true,
  );

  /*
      useStates
  */

  // LOCATION
  const [map, setMap] = useState<L.Map | null>(null);

  const [nominatim, setNominatim] = useState(null);
  const [
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,
  ] = useState([]);

  const [activeAdministrativeRegion, setActiveAdministrativeRegion] =
    useStateStorage<AdministrativeRegionObject>('activeAdministrativeRegion', {
      country: 'country',
      name: 'name',
      'intermediate-region': 'intermediate-region',
      'sub-region': 'sub-region',
      region: 'region',
    });

  const [activeGeographicIdentifier, setActiveGeographicIdentifier] =
    useStateStorage<GeographicIdentifier>(
      'activeGeographicIdentifier',
      geographicIdentifiers[1],
    ); // Default: Country Sort

  const [locationQuery, setLocationQuery] = useStateStorage<string>(
    'locationQuery',
    '',
  );

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
        top: document.getElementById('atlas-tabs').offsetTop * 1.312,
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
        top: document.getElementById('atlas-tabs').offsetTop,
        behavior: 'smooth',
      });

    const selection = {
      activeSelection: activeAdministrativeRegion[activeGeographicIdentifier],
      activeGeographicIdentifier: activeGeographicIdentifier,
      activeAdministrativeRegion: activeAdministrativeRegion,
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
    setTimeout(() => map.invalidateSize(), 300);
    setIsMobile(window.innerWidth < 768);
  };

  // Reset Atlas
  function resetAtlas() {
    setActiveLocationSelection([]);
    setAdministrativeRegionClickHistoryArray([]);
    setActiveAdministrativeRegion({
      country: 'country',
      name: 'name',
      'intermediate-region': 'intermediate-region',
      'sub-region': 'sub-region',
      region: 'region',
    });
    setActiveGeographicIdentifier(geographicIdentifiers[1]); // Default: Country Sort
    setLocationQuery('');
    setIsOpenAtlasMapInterface(!isMobile);

    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById('atlas-tabs').offsetTop,
        behavior: 'smooth',
      });
  }

  // Handle Browser Back Button
  //  Start
  // const handleBackButton = () => {
  //   const administrativeRegionWindow = JSON.parse(
  //     decodeURI(window.location.pathname.replace("/", ""))
  //   );

  //   const selectedAdministrativeRegion = administrativeRegionsData?.features.find(
  //     (administrativeRegion) => administrativeRegion.properties.id === administrativeRegionWindow.id
  //   );
  //   if (selectedAdministrativeRegion) setActiveAdministrativeRegion(selectedAdministrativeRegion.properties);
  // };

  // useEffect(() => {
  //   if (window.location.pathname.length > 1) handleBackButton();

  //   window.addEventListener("popstate", handleBackButton);

  //   return () => {
  //     window.removeEventListener("popstate", handleBackButton);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (window && activeAdministrativeRegion)
  //     window.history.pushState(
  //       null,
  //       "",
  //       `/${encodeURI(JSON.stringify(activeAdministrativeRegion))}`
  //     );
  // }, [activeAdministrativeRegion]);
  // End

  const interfaceProps = {
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

  const queryClient = new QueryClient({});

  const DisplayAtlasMap = useMemo(
    () => <AtlasMap {...interfaceProps} />,
    [activeAdministrativeRegion, activeGeographicIdentifier],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`atlas ${
          activeAdministrativeRegion.country !== 'Country' && 'atlas--active'
        }`}
        style={{
          gridTemplateColumns: `1.6180339887498948482fr ${legendSize}px`,
        }}
      >
        {isMobile && <AtlasInterface {...interfaceProps} />}
        <div className={`map-container`}>
          {DisplayAtlasMap}
          {!isMobile && <AtlasInterface {...interfaceProps} />}
        </div>
        <AtlasLegend interfaceProps={interfaceProps} />
      </div>
    </QueryClientProvider>
  );
}
