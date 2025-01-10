import React, { useMemo, createContext } from 'react';
import { createRootRoute } from '@tanstack/react-router';

// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '../css/Atlas.scss';

// Import Components
import AtlasMap from '../components/map/Index';
import AtlasInterface from '../components/map/AtlasInterface';

// Types
import { AtlasInterfaceProps, AtlasNavigation } from '../types/atlas.types';

import LegendNavigation from '../components/shared/AtlasNavigation';
import useAtlas from '../hooks/useAtlas';

export const AtlasContext = createContext<AtlasInterfaceProps | null>(null);

export const Route = createRootRoute({
  component: AtlasRootComponent,
  // validateSearch: (search: Record<string, unknown>) => {
  //   const geographicIdentifier = Object.keys(search);
  //   return {
  //     [geographicIdentifier[0]]: search.geographicIdentifier as string | number,
  //     id: search.id as number,
  //   };
  // },
});

function AtlasRootComponent() {
  const atlasInterfaceProps: AtlasInterfaceProps = useAtlas(Route);
  const {
    // Util
    isMobile,
    legendSize,
    activeGeographicIdentifier,
    activeAdministrativeRegion,
  } = atlasInterfaceProps;

  const DisplayAtlasMap = useMemo(
    () => <AtlasMap {...atlasInterfaceProps} route={Route} />,
    [activeAdministrativeRegion, activeGeographicIdentifier],
  );

  return (
    <AtlasContext.Provider value={atlasInterfaceProps}>
      <main
        className={`atlas ${
          activeAdministrativeRegion?.country !== 'country' && 'atlas--active'
        }`}
        style={{
          gridTemplateColumns: `1.6180339887498948482fr ${legendSize}px`,
        }}
        aria-label="Atlas Main View"
      >
        {isMobile && <AtlasInterface {...atlasInterfaceProps} />}
        <aside
          className={`map`}
          aria-label="Map"
          role="application"
          aria-description="Use arrow keys to pan, plus and minus to zoom"
        >
          {DisplayAtlasMap}
          {!isMobile && <AtlasInterface {...atlasInterfaceProps} />}
        </aside>
        <article
          id="legend"
          aria-label="Legend"
          aria-description="Find useful information pertaining to the selected location"
        >
          <LegendNavigation
            links={navigationLinks}
            route={Route}
          ></LegendNavigation>
        </article>
      </main>
      {/* <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" /> */}
    </AtlasContext.Provider>
  );
}

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/economy',
    emoji: '💵',
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
