export function AtlasNexusReadingList({
  // Util
  isMobile,
  resetAtlas,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

  regionTypes,
  activeRegionType,
  setActiveRegionType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  // Data
  activeIndicator,
  setActiveIndicator,

  // Community
  lemmyInstances,
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

  // Styles
  administrativeRegionStyle,
  administrativeRegionStyleHovered,
}) {
  return (
    <div>
      <h3>Reading List</h3>
      <a
        href={`https://bulletins.hexbear.net/tags/${encodeURI(
          activeAdministrativeRegion.country
        ).toLowerCase()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        72T's approved Reading List about {activeAdministrativeRegion.country}
      </a>
      <h3>News Bulletins</h3>
      <a
        href={`https://bulletins.hexbear.net/posts/readinglist/#${encodeURI(
          activeAdministrativeRegion.country
        ).toLowerCase()}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        72T's Bulletins on {activeAdministrativeRegion.country}
      </a>
    </div>
  );
}

export default AtlasNexusReadingList;
