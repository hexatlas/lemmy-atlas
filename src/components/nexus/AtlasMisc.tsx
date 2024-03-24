import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp } from "lemmy-js-client";

import Comment from "../lemmy/AtlasLemmyComment";
import Post from "../lemmy/AtlasLemmyPost";

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
      <h3>BannedThought</h3>

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
    </div>
  );
}

export default AtlasBannedThought;
