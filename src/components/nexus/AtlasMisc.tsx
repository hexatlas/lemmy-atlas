import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp } from "lemmy-js-client";

import Comment from "../fediverse/lemmy/AtlasLemmyComment";
import Post from "../fediverse/lemmy/AtlasLemmyPost";

/*
 /$$$$$$$                                                /$$          
| $$__  $$                                              | $$          
| $$  \ $$  /$$$$$$  /$$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$$          
| $$$$$$$  |____  $$| $$__  $$| $$__  $$ /$$__  $$ /$$__  $$          
| $$__  $$  /$$$$$$$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  | $$          
| $$  \ $$ /$$__  $$| $$  | $$| $$  | $$| $$_____/| $$  | $$          
| $$$$$$$/|  $$$$$$$| $$  | $$| $$  | $$|  $$$$$$$|  $$$$$$$          
|_______/  \_______/|__/  |__/|__/  |__/ \_______/ \_______/          
                                                                      
                                                                      
                                                                      
 /$$$$$$$$ /$$                                     /$$         /$$    
|__  $$__/| $$                                    | $$        | $$    
   | $$   | $$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$ | $$$$$$$  /$$$$$$  
   | $$   | $$__  $$ /$$__  $$| $$  | $$ /$$__  $$| $$__  $$|_  $$_/  
   | $$   | $$  \ $$| $$  \ $$| $$  | $$| $$  \ $$| $$  \ $$  | $$    
   | $$   | $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$  | $$ /$$
   | $$   | $$  | $$|  $$$$$$/|  $$$$$$/|  $$$$$$$| $$  | $$  |  $$$$/
   |__/   |__/  |__/ \______/  \______/  \____  $$|__/  |__/   \___/  
                                         /$$  \ $$                    
                                        |  $$$$$$/                    
                                         \______/                     
*/

export function AtlasBannedThought({
  // Util
  isMobile,
  resetAtlas,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

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
  const [bannedThought, setBannedThought] = useState(null);

  return (
    <div>
      <h3>World Inequality Database</h3>
      <a href="https://wid.world/data/" target="_blank" rel="noopener noreferrer">
        🔗 Visit https://wid.world/data/
      </a>

      <h3>UN Comtrade</h3>
      <a href="https://comtradeplus.un.org/" target="_blank" rel="noopener noreferrer">
        🔗 Visit UN Comtrade
      </a>

      <h3>International Labour Organization</h3>
      <a
        href="https://ilostat.ilo.org/resources/sdmx-tools/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Visit ILOSTAT
      </a>

      <h3>International Energy Agency</h3>
      {activeAdministrativeRegion.country != "country" && (
        <>
          <a
            href={`https://www.iea.org/search/charts?q=${encodeURI(
              activeAdministrativeRegion[activeLocationType]
            )
              .replace(/%20/g, "-")
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Charts on {activeAdministrativeRegion[activeLocationType]}
          </a>
        </>
      )}

      <h3>World Bank</h3>
      {activeAdministrativeRegion.country != "country" && (
        <>
          <a
            href={`https://data.worldbank.org/country/${encodeURI(
              activeAdministrativeRegion["alpha-2"]
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Data on {activeAdministrativeRegion[activeLocationType]}
          </a>
        </>
      )}

      <h3>OECD</h3>
      {activeAdministrativeRegion.country != "country" && (
        <>
          <a
            href={`https://data.oecd.org/${encodeURI(
              activeAdministrativeRegion[activeLocationType]
            )
              .replace(/%20/g, "-")
              .toLowerCase()}.htm`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Data on {activeAdministrativeRegion[activeLocationType]}
          </a>
          <br />
          <a
            href={`https://data.oecd.org/searchresults/?q=${encodeURI(
              activeAdministrativeRegion[activeLocationType]
            )
              .replace(/%20/g, "-")
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Search Results on {activeAdministrativeRegion[activeLocationType]} (if
            previous link is not working)
          </a>
        </>
      )}

      <h3>Marxian Rates of Profit</h3>
      <a
        href="https://dbasu.shinyapps.io/World-Profitability/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 World-Profitability Calculator
      </a>

      <h3>BannedThought.net</h3>
      <a
        href="http://bannedthought.net/RecentPostings.htm"
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 Recent Posts
      </a>
      <br />
      {activeAdministrativeRegion.country != "country" && (
        <a
          href={`http://bannedthought.net/${encodeURI(
            activeAdministrativeRegion[activeLocationType]
          ).replace(/%20/g, "-")}/index.htm`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Resources on {activeAdministrativeRegion[activeLocationType]}
        </a>
      )}
      <h3>WorldAtlas.com</h3>
      {activeAdministrativeRegion.country != "country" && (
        <>
          <a
            href={`https://www.worldatlas.com/maps/${encodeURI(
              activeAdministrativeRegion[activeLocationType]
            )
              .replace(/%20/g, "-")
              .toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 World Atlas on {activeAdministrativeRegion[activeLocationType]}
          </a>
        </>
      )}
    </div>
  );
}

export default AtlasBannedThought;
