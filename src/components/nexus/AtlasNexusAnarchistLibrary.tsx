import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp } from "lemmy-js-client";

import Comment from "../fediverse/lemmy/AtlasLemmyComment";
import Post from "../fediverse/lemmy/AtlasLemmyPost";
import { useSessionStorage } from "../../hooks/useAtlasUtils";

/*
  /$$$$$$                                          /$$       /$$             /$$    
 /$$__  $$                                        | $$      |__/            | $$    
| $$  \ $$ /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$| $$$$$$$  /$$  /$$$$$$$ /$$$$$$  
| $$$$$$$$| $$__  $$ |____  $$ /$$__  $$ /$$_____/| $$__  $$| $$ /$$_____/|_  $$_/  
| $$__  $$| $$  \ $$  /$$$$$$$| $$  \__/| $$      | $$  \ $$| $$|  $$$$$$   | $$    
| $$  | $$| $$  | $$ /$$__  $$| $$      | $$      | $$  | $$| $$ \____  $$  | $$ /$$
| $$  | $$| $$  | $$|  $$$$$$$| $$      |  $$$$$$$| $$  | $$| $$ /$$$$$$$/  |  $$$$/
|__/  |__/|__/  |__/ \_______/|__/       \_______/|__/  |__/|__/|_______/    \___/  
                                                                                    
                                                                                    
                                                                                    
 /$$       /$$ /$$                                                                  
| $$      |__/| $$                                                                  
| $$       /$$| $$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$  /$$   /$$                     
| $$      | $$| $$__  $$ /$$__  $$|____  $$ /$$__  $$| $$  | $$                     
| $$      | $$| $$  \ $$| $$  \__/ /$$$$$$$| $$  \__/| $$  | $$                     
| $$      | $$| $$  | $$| $$      /$$__  $$| $$      | $$  | $$                     
| $$$$$$$$| $$| $$$$$$$/| $$     |  $$$$$$$| $$      |  $$$$$$$                     
|________/|__/|_______/ |__/      \_______/|__/       \____  $$                     
                                                      /$$  | $$                     
                                                     |  $$$$$$/                     
                                                      \______/                      
                                                      
                                                      */

export function AtlasNexusReadingList({
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
  const [anarchistLibrary, setAnarchistLibrary] = useSessionStorage(
    "anarchistLibrary",
    []
  );

  const fetchAnarchistLibrary = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const AnarchistLibraryArray = await response.json(); // Retrieve response as text

      setAnarchistLibrary(AnarchistLibraryArray);
    } catch (error) {
      console.log(error);
    }
  };

  function HexBearNews({ bulletin }) {
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    function getHexbear(anarchistLibrary) {
      let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
      let form: Search = {
        community_id: activeCommunity?.counts?.community_id,
        type_: "All",
        listing_type: "All",
        sort: "TopAll",
        q: anarchistLibrary.author,
        page: 1,
      };

      client.search(form).then((res) => {
        setComments([]);
        setPosts([]);

        if (comments && res?.comments) setComments(res?.comments);
        if (posts && res?.posts) setPosts(res?.posts);
        setIsLoaded(true);
      });
    }

    return (
      <div className="anarchist-library-community">
        {!isLoaded && (
          <p
            className="reply-button"
            role="button"
            tabIndex={0}
            aria-label="Show Replies"
            onClick={() => getHexbear(bulletin)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Space") {
                () => getHexbear(bulletin);
              }
            }}
          >
            <span className="post-replycount-icon">💬</span> Search Author on hexbear.net
          </p>
        )}
        {posts.length > 0 && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={index}
                  post={post}
                  community={activeCommunity}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        {comments.length > 0 &&
          comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                community={activeCommunity}
                post={comment}
                lemmyInstance={activeLemmyInstance}
                sort={activeSortType}
                ratioDetector={comment?.counts.score}
                isOpen={false}
              />
            );
          })}
      </div>
    );
  }

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "country") {
      const apiUrl = `/.netlify/functions/anarchist_library/?country=${encodeURI(
        activeAdministrativeRegion[activeLocationType]
      )}`;
      fetchAnarchistLibrary(apiUrl);
    } else {
      const apiUrl = `/.netlify/functions/anarchist_library/`;
      fetchAnarchistLibrary(apiUrl);
    }
  }, [activeAdministrativeRegion, activeLocationType]);

  return (
    <div id="legend-content">
      <h3>Anarchist Library</h3>
      <a
        href={`https://theanarchistlibrary.org/search?query=${encodeURI(
          activeAdministrativeRegion[activeLocationType]
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📚📕 Books about{" "}
        {activeAdministrativeRegion.country != "country" &&
          activeAdministrativeRegion[activeLocationType]}
      </a>

      {anarchistLibrary?.length > 0 && (
        <>
          {anarchistLibrary &&
            anarchistLibrary.map((book, index) => {
              return (
                <div className="anarchist-library-item" key={index}>
                  <p className="anarchist-library-publish-date ">
                    🗓️ {new Date(book.pubdate_iso).toDateString()}
                  </p>
                  <h4 className="anarchist-library-link">{book.title}</h4>
                  {book.author && (
                    <p className="anarchist-library-author highlight">👤 {book.author}</p>
                  )}
                  {book.subtitle && <p>ℹ️ {book.subtitle}</p>}
                  {book.feed_teaser && (
                    <Collapsible.Root>
                      <Collapsible.Trigger className="view-more">
                        Show More
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <div dangerouslySetInnerHTML={{ __html: book.feed_teaser }}></div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  )}{" "}
                  <div className="anarchist-library-container">
                    <a
                      className="anarchist-library-readmore"
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read {book.text_type}
                    </a>
                    {book.pages_estimated && <span>~{book.pages_estimated} 📄</span>}
                  </div>
                  <HexBearNews bulletin={book} />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}

export default AtlasNexusReadingList;
