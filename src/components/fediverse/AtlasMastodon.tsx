import { useEffect, useState } from "react";
import { TimeAgo } from "../../hooks/useDataTransform";
import { useSessionStorage } from "../../hooks/useAtlasUtils";

function AtlasMastodon({
  // Util
  isMobile,
  resetAtlas,
  sideBarRef,

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
  const [mastonPosts, setMastonPosts] = useSessionStorage("mastonPosts", []);

  const featchMastodon = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const mastondonPostsData = await response.json(); // Retrieve response as text
      console.log(mastondonPostsData);

      setMastonPosts(mastondonPostsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeAdministrativeRegion.country !== "country") {
      const apiUrl = `/.netlify/functions/mastodon/?country=${encodeURI(
        activeAdministrativeRegion.country
      )
        .toLowerCase()
        .replace(/%20/g, "-")}`;
      featchMastodon(apiUrl);
    }
  }, [activeAdministrativeRegion]);

  return (
    <>
      <div id="legend-content">
        <h3>Latest Posts on {activeAdministrativeRegion.country}</h3>
        {mastonPosts &&
          mastonPosts.map((post, index) => (
            <div className="feed-item" key={index}>
              <div className="feed-post-container">
                <div
                  className="post-thumbnail-container"
                  tabIndex={0}
                  aria-label="Expand Post"
                >
                  <img
                    className="post-thumbnail-image"
                    src={post.account.avatar}
                    alt={post.account.username}
                  />
                </div>
                <div>
                  <p className="feed-publish-date highlight">
                    {post.edited_at && <span>🖊️</span>}
                    {" 🗓️ "}
                    <small className="post-timestamp">
                      <TimeAgo
                        dateString={post?.edited_at ? post.edited_at : post.created_at}
                      />
                    </small>
                  </p>
                  <p>{post.account.display_name}</p>
                  <small>
                    {post.account.bot && <span>🤖</span>}
                    <a href={post.account.uri} target="_blank" rel="noopener noreferrer">
                      {post.account.acct}
                    </a>
                  </small>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
              <div className="feed-post-container">
                <p>💬 {post.replies_count}</p>
                <p>🔄 {post.reblogs_count}</p>
                <p>⭐ {post.favourites_count}</p>
              </div>
              <a
                className="post-link"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 <small>{post.url}</small>
              </a>
            </div>
          ))}
      </div>
      <a
        href={`https://mastodon.social/tags/${activeAdministrativeRegion.country}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View more on Mastodon.Social
      </a>
    </>
  );
}

export default AtlasMastodon;
