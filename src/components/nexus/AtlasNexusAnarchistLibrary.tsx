import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";

// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { Search, LemmyHttp } from "lemmy-js-client";

import Comment from "../lemmy/AtlasLemmyComment";
import Post from "../lemmy/AtlasLemmyPost";

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
  const [anarchistLibrary, setAnarchistLibrary] = useState([]);

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

    function getHexbear(anarchistLibraryURL) {
      let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
      let form: Search = {
        type_: "All",
        listing_type: "All",
        sort: activeSortType,
        q: anarchistLibraryURL,
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
      <div className="bulletin-community">
        {!isLoaded && (
          <p
            className="reply-button"
            role="button"
            tabIndex={0}
            aria-label="Show Replies"
            onClick={() => getHexbear(bulletin.link)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Space") {
                () => getHexbear(bulletin.link);
              }
            }}
          >
            <span className="post-replycount-icon">💬</span> /c/news
          </p>
        )}
        {posts && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={index}
                  post={post}
                  community={{ id: 6 }}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        {comments &&
          comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                community={{ id: 6 }}
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
    console.log(anarchistLibrary);
  }, [anarchistLibrary]);

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "country") {
      const apiUrl = `/.netlify/functions/anarchist_library/?country=${encodeURI(
        activeAdministrativeRegion.country
      )}`;
      fetchAnarchistLibrary(apiUrl);
    } else {
      const apiUrl = `/.netlify/functions/anarchist_library/?index=true`;
      fetchAnarchistLibrary(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <div>
      <h3>Anarchist Library</h3>
      <a
        href={`https://theanarchistlibrary.org/search?query=${encodeURI(
          activeAdministrativeRegion.country
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📚📕 Books about{" "}
        {activeAdministrativeRegion.country != "country" &&
          activeAdministrativeRegion.country}
      </a>

      {anarchistLibrary?.length > 0 && (
        <>
          {anarchistLibrary &&
            anarchistLibrary.map((book, index) => {
              return (
                <div className="bulletin-item" key={index}>
                  {book.author && (
                    <p className="bulletin-author  bulletin-publish-date highlight">
                      👤 {book.author}
                    </p>
                  )}
                  <h4 className="bulletin-link" href={book.url}>
                    {book.title}
                  </h4>
                  {book.subtitle && <p>ℹ️ {book.subtitle}</p>}
                  {book.pages_estimated && <p>~{book.pages_estimated} 📄</p>}{" "}
                  {book.feed_teaser && (
                    <Collapsible.Root>
                      <Collapsible.Trigger>Show More</Collapsible.Trigger>
                      <Collapsible.Content>
                        <div dangerouslySetInnerHTML={{ __html: book.feed_teaser }}></div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  )}{" "}
                  <p className="bulletin-publish-date ">
                    🗓️ {new Date(book.pubdate_iso).toDateString()}
                  </p>
                  <a
                    className="bulletin-readmore"
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read {book.text_type}
                  </a>
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
