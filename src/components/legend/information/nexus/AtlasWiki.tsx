import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useStateStorage } from "../../../hooks/useAtlasUtils";
import { useQuery } from "@tanstack/react-query";

/*
 /$$      /$$ /$$ /$$       /$$
| $$  /$ | $$|__/| $$      |__/
| $$ /$$$| $$ /$$| $$   /$$ /$$
| $$/$$ $$ $$| $$| $$  /$$/| $$
| $$$$_  $$$$| $$| $$$$$$/ | $$
| $$$/ \  $$$| $$| $$_  $$ | $$
| $$/   \  $$| $$| $$ \  $$| $$
|__/     \__/|__/|__/  \__/|__/
                               
                                                              
*/

export function AtlasProleWiki({
  wikiURL,
  isProleWiki = false,

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

  regionTypes,
  activeLocationType,
  setActiveLocationType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

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
}) {
  const fetchProleWiki = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      return result?.parse;
    } catch (error) {
      console.log(error);
    }
  };

  const apiUrl = `/.netlify/functions/wiki/?country=${encodeURI(
    activeAdministrativeRegion[activeLocationType]
  )}&wiki=${wikiURL}`;

  const { data, isLoading } = useQuery({
    queryKey: [
      `WIKI-${isProleWiki ? "prole" : "nato"}-${activeAdministrativeRegion["alpha-2"]}`,
    ],
    queryFn: () => fetchProleWiki(apiUrl),
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
  });

  return (
    <>
      <div id="legend-content" className="prolewiki">
        {isProleWiki ? (
          <>
            <p>
              Please consider contributing knowledge on{" "}
              <a
                href={`https://en.prolewiki.org/?search=${encodeURI(
                  activeAdministrativeRegion[activeLocationType]
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeLocationType]} on {wikiURL}
              </a>
            </p>

            <a
              href={`https://en.prolewiki.org/wiki/Category:Library_works_about_${encodeURI(
                activeAdministrativeRegion.country
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📚📕 All library works about {activeAdministrativeRegion.country} on
              ProleWiki.
            </a>
          </>
        ) : (
          <>
            <p>
              Please consider correcting information on{" "}
              <a
                href={`${wikiURL}?search=${encodeURI(
                  activeAdministrativeRegion[activeLocationType]
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeAdministrativeRegion[activeLocationType]} on {wikiURL}
              </a>
            </p>
          </>
        )}
        <hr />
        <br />
        {data && (
          <>
            <h3>{data.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: data?.text["*"] }}></div>
          </>
        )}
      </div>
      <div className="legend-footer">
        <a
          href={`${wikiURL}?search=${encodeURI(
            activeAdministrativeRegion[activeLocationType]
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View more on {wikiURL}
        </a>
      </div>
    </>
  );
}

export default AtlasProleWiki;
