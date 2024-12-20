import React, { createContext } from 'react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { CommunityView } from 'lemmy-js-client';

import {
  AtlasLemmyListingType,
  AtlasLemmySearchType,
  AtlasLemmySortType,
  AtlasLemmyInstanceType,
  listingTypes,
  searchTypes,
  sortTypes,
} from '../types/api.types';
import { useStateStorage } from '../hooks/useAtlasUtils';
import { InformationLemmyProps } from '../types/atlas.types';

export const InformationContext = createContext<InformationLemmyProps | null>(
  null,
);

export const Route = createFileRoute('/information')({
  component: InformationRouteComponent,
});

function InformationRouteComponent() {
  const defaultInstance = {
    id: 0,
    label: 'hexbear.net',
    baseUrl: 'https://hexbear.net/',
    community_id: 6, // !news@hexbear.net
    default: true,
  };

  // LEMMY
  const [activeLemmyInstance, setActiveLemmyInstance] =
    useStateStorage<AtlasLemmyInstanceType>(
      'activeLemmyInstance',
      defaultInstance, // Default: hexbear.net
    );

  const [activeCommunity, setActiveCommunity] = useStateStorage<CommunityView>(
    'activeCommunity',
    null,
  );

  const [activeSearchType, setActiveSearchType] =
    useStateStorage<AtlasLemmySearchType>('activeSearchType', searchTypes[0]); // Default: Comments

  const [activeListingType, setActiveListingType] =
    useStateStorage<AtlasLemmyListingType>(
      'activeListingType',
      listingTypes[1],
    ); // Default: Local

  const [activeSortType, setActiveSortType] =
    useStateStorage<AtlasLemmySortType>('activeSortType', sortTypes[1]); // Default: New Sort

  const informationLemmyProps: InformationLemmyProps = {
    // Community
    defaultInstance,
    activeLemmyInstance,
    setActiveLemmyInstance,

    activeCommunity,
    setActiveCommunity,

    activeSearchType,
    setActiveSearchType,

    listingTypes,
    activeListingType,
    setActiveListingType,

    sortTypes,
    activeSortType,
    setActiveSortType,
  };

  return (
    <InformationContext.Provider value={informationLemmyProps}>
      <div id="atlas-tabs" className="atlas-tabs tabs-root">
        <div className="tabs-list">
          <Link className="tabs-trigger emoji-label" to="/information/links">
            🔗
          </Link>
          <Link className="tabs-trigger emoji-label" to="/information/map">
            🌐
          </Link>
          <Link className="tabs-trigger emoji-label" to="/information/nexus">
            📚
          </Link>
          <Link
            className="tabs-trigger emoji-label"
            to="/information/fediverse"
          >
            👥
          </Link>
        </div>
        <Outlet />
      </div>
    </InformationContext.Provider>
  );
}
