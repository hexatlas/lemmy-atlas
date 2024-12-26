import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
} from 'react';
import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '../css/Atlas.scss';

// Import Components
import AtlasMap from '../components/map/Index';
import AtlasInterface from '../components/map/AtlasInterface';

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
  AtlasNavigation,
} from '../types/atlas.types';

import L from 'leaflet';
import LegendNavigation from '../components/shared/AtlasNavigation';

export const AtlasContext = createContext<AtlasInterfaceProps | null>(null);

export const Route = createRootRoute({
  component: AtlasRootComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/economy',
    emoji: '🪙',
    isDisabled: false,
  },
  {
    link: '/information',
    emoji: 'ℹ️',
    isDisabled: false,
  },
  {
    link: '/diplomacy',
    emoji: '🕊️',
    isDisabled: false,
  },
  {
    link: '/military',
    emoji: '🛡️',
    isDisabled: false,
  },
  {
    link: '/government',
    emoji: '🏛️',
    isDisabled: false,
  },
];

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

function AtlasRootComponent() {
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

  const atlasInterfaceProps: AtlasInterfaceProps = {
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

  const DisplayAtlasMap = useMemo(
    () => <AtlasMap {...atlasInterfaceProps} />,
    [activeAdministrativeRegion, activeGeographicIdentifier],
  );

  return (
    <AtlasContext.Provider value={atlasInterfaceProps}>
      <main
        className={`atlas ${
          activeAdministrativeRegion.country !== 'Country' && 'atlas--active'
        }`}
        style={{
          gridTemplateColumns: `1.6180339887498948482fr ${legendSize}px`,
        }}
        aria-label="Atlas Main View"
      >
        {isMobile && <AtlasInterface {...atlasInterfaceProps} />}
        <aside
          className={`map-container`}
          aria-label="Map"
          role="application"
          aria-description="Use arrow keys to pan, plus and minus to zoom"
        >
          {DisplayAtlasMap}
          {!isMobile && <AtlasInterface {...atlasInterfaceProps} />}
        </aside>
        <article
          aria-label="Legend"
          aria-description="Find useful information pertaining to the selected location"
        >
          <LegendNavigation
            links={navigationLinks}
            route={Route}
          ></LegendNavigation>
        </article>
      </main>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </AtlasContext.Provider>
  );
}
