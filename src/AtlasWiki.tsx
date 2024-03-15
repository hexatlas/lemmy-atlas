import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function AtlasProleWiki({
  wikiURL,

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
  const [proleWiki, setProleWiki] = useState(null);

  const fetchProleWiki = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setProleWiki(result?.parse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "country") {
      const apiUrl = `/.netlify/functions/wiki/?country=${encodeURI(
        activeAdministrativeRegion.country
      )}&wiki=${wikiURL}`;
      fetchProleWiki(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <div className="prolewiki">
      <a
        href={`https://en.prolewiki.org/?search=${encodeURI(
          activeRegionType
            ? activeAdministrativeRegion.country
            : activeAdministrativeRegion.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 View {activeAdministrativeRegion.country} on ProleWiki
      </a>
      {proleWiki && (
        <>
          <h3>{proleWiki.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: proleWiki?.text["*"] }}></div>
        </>
      )}
    </div>
  );
}

export default AtlasProleWiki;
