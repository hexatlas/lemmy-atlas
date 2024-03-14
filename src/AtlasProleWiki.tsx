import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import parseInfo from "infobox-parser";

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
  const [infoCard, setInfoCard] = useState(null);

  const fetchProleWiki = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setProleWiki(result);
      if (result.source) setInfoCard(parseInfo(result.source));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "Country") {
      const apiUrl = `/.netlify/functions/prolewiki/?country=${encodeURI(
        activeAdministrativeRegion.country
      ).toLowerCase()}`;
      fetchProleWiki(apiUrl);
    } else {
      const apiUrl = `/.netlify/functions/prolewiki/?index=true`;
      fetchProleWiki(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <div>
      <a
        href={`https://en.prolewiki.org/?search=${encodeURI(
          activeAdministrativeRegion.country
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 {activeAdministrativeRegion.country}
      </a>
      {proleWiki && (
        <>
          <h3>{proleWiki.title}</h3>
          <p>{JSON.stringify(proleWiki?.source)}</p>
        </>
      )}
    </div>
  );
}

export default AtlasProleWiki;
