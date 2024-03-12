import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { GetComments, LemmyHttp } from "lemmy-js-client";

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
  const [bulletinsData, setBulletinsData] = useState(null);

  const fetchBulletinsRSS = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const xmlString = await response.text(); // Retrieve response as text

      const parser = new DOMParser();
      const xmlData = parser.parseFromString(xmlString, "text/xml");

      const items = Array.from(xmlData.getElementsByTagName("item")).map((item) => ({
        title: item.querySelector("title").textContent,
        link: item.querySelector("link").textContent,
        pubDate: item.querySelector("pubDate").textContent,
        description: item.querySelector("description").textContent,
      }));

      const parsedData = {
        title: xmlData.querySelector("title").textContent,
        link: xmlData.querySelector("link").textContent,
        description: xmlData.querySelector("description").textContent,
        generator: xmlData.querySelector("generator").textContent,
        language: xmlData.querySelector("language").textContent,
        lastBuildDate: xmlData.querySelector("lastBuildDate").textContent,
        items: items,
      };

      console.log(parsedData, "resp");

      setBulletinsData(parsedData);
    } catch (error) {
      console.log(error);
      setBulletinsData({ error: error.message });
    }
  };

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "Country") {
      const apiUrl = `/.netlify/functions/72T_bulletins/?country=${encodeURI(
        activeAdministrativeRegion.country
      )
        .toLowerCase()
        .replace(/%20/g, "-")}`;
      fetchBulletinsRSS(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <div>
      {activeAdministrativeRegion.country != "Country" && (
        <>
          <h3>Reading List</h3>
          <a
            href={`https://bulletins.hexbear.net/posts/readinglist/#${encodeURI(
              activeAdministrativeRegion.country
            )
              .toLowerCase()
              .replace(/%20/g, "-")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hexbear reading list about {activeAdministrativeRegion.country}
          </a>

          {bulletinsData && (
            <>
              <h3>{bulletinsData.title}</h3>
              <p> {bulletinsData.description}</p>
              <a href={bulletinsData.link} target="_blank" rel="noopener noreferrer">
                {bulletinsData.link}
              </a>
              {bulletinsData.items &&
                bulletinsData.items.map((bulletin) => {
                  return (
                    <div className="bulletin-item">
                      <p className="bulletin-publish-date highlight">
                        🗓️ {new Date(bulletin.pubDate).toDateString()}
                      </p>
                      <a href={bulletin.link} target="_blank" rel="noopener noreferrer">
                        🔗 {bulletin.title}
                      </a>
                      <ReactMarkdown>{`📰 ${bulletin.description}`}</ReactMarkdown>
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AtlasNexusReadingList;
