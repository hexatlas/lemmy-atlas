import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function AtlasProleWiki({
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
    if (activeAdministrativeRegion.country !== "Country") {
      const apiUrl = `/.netlify/functions/prolewiki/?country=${encodeURI(
        activeAdministrativeRegion.country
      )}`;
      fetchProleWiki(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <div className="prolewiki">
      <a
        href={`https://en.prolewiki.org/?search=${encodeURI(
          activeAdministrativeRegion.country
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
