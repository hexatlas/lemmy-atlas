// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { ListCommunities, GetCommunity, LemmyHttp, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Comment from "./AtlasLemmyComment";
import Post from "./AtlasLemmyPost";
import LemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

import { searchTypes } from "../../../Atlas_Config";
import AtlasLemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";
import { useStateStorage } from "../../../hooks/useAtlasUtils";

/*

 /$$                                                      
| $$                                                      
| $$        /$$$$$$  /$$$$$$/$$$$  /$$$$$$/$$$$  /$$   /$$
| $$       /$$__  $$| $$_  $$_  $$| $$_  $$_  $$| $$  | $$
| $$      | $$$$$$$$| $$ \ $$ \ $$| $$ \ $$ \ $$| $$  | $$
| $$      | $$_____/| $$ | $$ | $$| $$ | $$ | $$| $$  | $$
| $$$$$$$$|  $$$$$$$| $$ | $$ | $$| $$ | $$ | $$|  $$$$$$$
|________/ \_______/|__/ |__/ |__/|__/ |__/ |__/ \____  $$
                                                 /$$  | $$
                                                |  $$$$$$/
                                                 \______/ 
*/

export default function AtlasLemmy({
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
  const [communityList, setCommunityList] = useState(null);
  const [currentCommunityPage, setCurrentCommunityPage] = useState(1);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);

  const [regionSearchResult, setRegionSearchResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSearchResultPage, setCurrentSearchResultPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /*
    Handlers
  */

  function handleSearchQuery() {
    return `${locationQuery} ${
      activeAdministrativeRegion["country"] === "country"
        ? ""
        : activeAdministrativeRegion[activeLocationType]
    }`;
  }

  let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
  let form: Search = {
    community_id: activeCommunity?.counts?.community_id,
    type_: activeSearchType.value,
    listing_type: activeListingType.value,
    sort: activeSortType.value,
    q: handleSearchQuery(),
    page: currentSearchResultPage,
  };

  function handleUpdate() {
    if (locationQuery) {
      setCurrentCommunityPage(1);
      handleSearchCommunities(locationQuery);
    } else {
      handleCommunityList();
    }

    client.search(form).then((res) => {
      // setPosts([]);
      // setComments([]);

      if (activeSearchType.value === "Comments") {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments) setComments(res?.comments);
      }

      if (activeSearchType.value === "Posts") {
        setComments([]);
        if (res?.posts.length < 10) {
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts(res?.posts);
      }
    });
  }

  function handleShowMore() {
    client.search(form).then((res) => {
      setPosts([]);
      setComments([]);

      if (activeSearchType.value === "Comments") {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments) setComments([...comments, ...res?.comments]);
      }

      if (activeSearchType.value === "Posts") {
        setComments([]);
        if (res?.posts.length < 10) {
          0;
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts([...posts, ...res?.posts]);
      }
    });
  }

  // Gets list of communites from active lemmy instance
  function handleCommunityList() {
    let form: ListCommunities = {
      type_: activeListingType.value,
      sort: "TopAll",
      page: currentCommunityPage,
    };

    client.listCommunities(form).then((res) => {
      if (res?.communities.length < 10) {
        setHasMoreCommunities(false);
      }
      setCommunityList(() =>
        currentCommunityPage === 1
          ? res?.communities
          : [...communityList, ...res?.communities]
      );
    });
  }

  // Searches for Communites, used in Query Field
  function handleSearchCommunities(searchQuery) {
    let form: Search = {
      q: searchQuery,
      type_: "Communities",
      listing_type: activeListingType.value,
    };

    client.search(form).then((res) => {
      setCommunityList(res?.communities);
    });
  }

  const handleScroll = () => {
    // Check if user has scrolled to the bottom
    if (sideBarRef.current.scrollTop > sideBarRef.current.scrollTopMax - 69) {
      // Fetch more comments if there are more to fetch
      if (hasMore) {
        console.log("SCROLL");

        setCurrentSearchResultPage(currentSearchResultPage + 1);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLocationQuery(e.target.value);
  };

  /*
    useEffects
  */

  // useEffect(() => {
  //   if (sideBarRef && sideBarRef.current)
  //     sideBarRef.current.addEventListener("scroll", handleScroll, false);

  //   return () => {
  //     if (sideBarRef && sideBarRef.current)
  //       sideBarRef.current.addEventListener("scroll", handleScroll, false);
  //   };
  // }, []);

  //  init

  // Reset Query when location or location query is changed
  useEffect(() => {
    setComments([]);
    setPosts([]);
    setCurrentSearchResultPage(1);
    setHasMore(false);
  }, [activeAdministrativeRegion, activeLocationType, activeSearchType, locationQuery]);

  // Reset when Lemmy Instance is changed
  useEffect(() => {
    setCommunityList(null);
    setActiveCommunity(null);
    setCurrentCommunityPage(1);
    setHasMoreCommunities(true);
    handleCommunityList();
  }, [activeLemmyInstance]);

  useEffect(() => {
    handleCommunityList();
  }, [currentCommunityPage]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleUpdate();
    }, 1312);
    return () => clearTimeout(debounce);
  }, [
    activeAdministrativeRegion,
    activeLocationType,
    activeLemmyInstance,
    activeCommunity,
    activeListingType,
    activeSortType,
    activeSearchType,
    locationQuery,
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleShowMore();
    }, 1312);
    return () => clearTimeout(debounce);
  }, [currentSearchResultPage]);

  const BasedClientDetector = () => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const isLinux = navigator.platform.toLowerCase().indexOf("linux") > -1;

    // ToDo: Add Adblock detection

    return (
      <div className="based-client-detector">
        {isFirefox && isLinux && <p>Based Check Passed 🫡</p>}
        {!isFirefox && (
          <p>
            ⚠️ ⚠️ ⚠️ Switch to{" "}
            <a
              href="https://www.mozilla.org/en-US/firefox/browsers/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
            .
          </p>
        )}
        {!isLinux && !isMobile && <p>⚠️ ⚠️ ⚠️ Why are you not using linux 😡</p>}
      </div>
    );
  };

  return (
    <>
      <div id="legend-content" className="legend-content-container">
        {activeCommunity && activeCommunity?.community?.banner && (
          <LemmyCommunityInfoCard
            lemmyInstance={activeLemmyInstance}
            community={activeCommunity?.community}
            sort={activeSortType}
          >
            <img
              className="banner-image"
              src={activeCommunity?.community?.banner}
              alt={`${activeCommunity?.community?.name} Community Banner`}
            />
          </LemmyCommunityInfoCard>
        )}

        <div className="search-input-wrapper">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="button-icon" aria-label="Community Settings Menu">
                ☰
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                collisionPadding={1.6180339887498948482 ^ 14}
                className="dropdown-menu-content"
              >
                <DropdownMenu.Item className="dropdown-menu-item">
                  <div
                    className="reset-container"
                    role="button"
                    aria-label="Reset Community Settings"
                    tabIndex={0}
                    onClick={resetAtlas}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Space") {
                        resetAtlas;
                      }
                    }}
                  >
                    <p>Reset</p>
                    <div className="right-slot reset-button">⟲</div>
                  </div>
                </DropdownMenu.Item>

                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                    Instance
                    <div className="right-slot">▸</div>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent className="dropdown-menu-subcontent">
                      <DropdownMenu.RadioGroup
                        value={activeLemmyInstance}
                        onValueChange={setActiveLemmyInstance}
                      >
                        {lemmyInstances.map((instance, index) => (
                          <DropdownMenu.RadioItem
                            key={index}
                            className="dropdown-menu-radio-item"
                            value={instance}
                          >
                            <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                              ✔
                            </DropdownMenu.ItemIndicator>
                            {instance.label}
                          </DropdownMenu.RadioItem>
                        ))}
                      </DropdownMenu.RadioGroup>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator className="dropdown-menu-separator" />
                <DropdownMenu.Label className="dropdown-menu-label">
                  {activeSearchType.label} by {activeSortType.label}
                </DropdownMenu.Label>
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                    Sorting
                    <div className="right-slot">▸</div>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent className="dropdown-menu-subcontent">
                      <DropdownMenu.RadioGroup
                        value={activeSortType}
                        onValueChange={setActiveSortType}
                      >
                        {sortTypes.map((sort, index) => (
                          <DropdownMenu.RadioItem
                            key={index}
                            className="dropdown-menu-radio-item"
                            value={sort}
                          >
                            <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                              ✔
                            </DropdownMenu.ItemIndicator>
                            {sort.label}
                          </DropdownMenu.RadioItem>
                        ))}
                      </DropdownMenu.RadioGroup>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>

                <DropdownMenu.Separator className="dropdown-menu-separator" />
                <DropdownMenu.Label className="dropdown-menu-label">
                  {activeCommunity?.community?.name
                    ? "c/" + activeCommunity?.community.name
                    : "Type"}
                </DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  value={activeSearchType}
                  onValueChange={setActiveSearchType}
                >
                  {searchTypes.map((searchType, index) => (
                    <DropdownMenu.RadioItem
                      key={index}
                      className="dropdown-menu-radio-item"
                      value={searchType}
                      // disabled={index != 1}
                    >
                      <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                        ✔
                      </DropdownMenu.ItemIndicator>
                      {searchType.label}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator className="dropdown-menu-separator" />
                <DropdownMenu.Label className="dropdown-menu-label">
                  {activeLemmyInstance.label}
                </DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  value={activeListingType}
                  onValueChange={setActiveListingType}
                >
                  {listingTypes.map((listingType, index) => (
                    <DropdownMenu.RadioItem
                      key={index}
                      className="dropdown-menu-radio-item"
                      value={listingType}
                      disabled={index > 1}
                    >
                      <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                        ✔
                      </DropdownMenu.ItemIndicator>
                      {listingType.label}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {activeAdministrativeRegion.country !== "country" && (
            <button
              role="button"
              title="Reset Atlas to default settings"
              aria-label="Styled Reset Atlas Settings to default settings"
              className="atlas-reset-button"
              onClick={resetAtlas}
            >
              {activeAdministrativeRegion[activeLocationType]} ⨯
            </button>
          )}
          {activeCommunity?.community && (
            <LemmyCommunityInfoCard
              lemmyInstance={activeLemmyInstance}
              community={activeCommunity?.community}
              sort={activeSortType}
            >
              <button
                role="button"
                title="Reset Atlas to default settings"
                aria-label="Styled Reset Atlas Settings to default settings"
                className="atlas-reset-button"
                onClick={() => setActiveCommunity(null)}
              >
                <span className="prefix">c/</span>
                {activeCommunity && activeCommunity?.community?.name} ⨯
              </button>
            </LemmyCommunityInfoCard>
          )}
          <div className="search-form">
            <label htmlFor="search-input" className="sr-only">
              Query Selected Location
            </label>
            <input
              name="search-input"
              type="text"
              className="search-input"
              aria-label="Query Selected Community about Region"
              placeholder="Query"
              value={locationQuery}
              onChange={handleSearch}
            />
          </div>{" "}
        </div>

        <div className="community-list">
          {communityList &&
            communityList.map((community) => {
              return (
                <button
                  key={community?.counts?.community_id}
                  className={`community-button ${
                    community?.counts?.community_id ===
                      activeCommunity?.counts?.community_id && "community-button-active"
                  }`}
                  role="button"
                  aria-label={`${community?.community?.name} community filter`}
                  onClick={() => {
                    if (activeCommunity === community) {
                      setActiveCommunity(null);
                    } else {
                      setActiveCommunity(community);
                    }
                  }}
                >
                  {community?.community?.name}
                </button>
              );
            })}
          {/* {hasMoreCommunities && (
          <button
            role="button"
            className="community-button community-button-more"
            onClick={() => setCurrentCommunityPage(currentCommunityPage + 1)}
            aria-label="View More Communites"
          >
            +
          </button>
        )} */}
        </div>
        {comments && activeSearchType.value === "Comments" && (
          <div className="post-reply-container">
            {comments.length > 0 &&
              comments.map(
                (comment, index) =>
                  comment?.comment?.removed ||
                  comment?.comment?.deleted || (
                    <Comment
                      key={`${comment?.comment.id}${index * Math.random()}`}
                      post={comment}
                      community={activeCommunity}
                      lemmyInstance={activeLemmyInstance}
                      sort={activeSortType}
                      ratioDetector={undefined}
                    />
                  )
              )}
          </div>
        )}
        {posts && activeSearchType.value === "Posts" && (
          <div className="post-reply-container">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <Post
                  key={`${post?.post.id}${index * Math.random()}`}
                  post={post}
                  community={activeCommunity}
                  lemmyInstance={activeLemmyInstance}
                  activeListingType={activeListingType}
                  sort={activeSortType}
                />
              ))}
          </div>
        )}
        <button
          className="view-more"
          onClick={() => setCurrentSearchResultPage(currentSearchResultPage + 1)}
        >
          View More
        </button>
        {/* {activeSearchType === "Posts" && regionSearchResult && (
        <p>{regionSearchResult.posts === 0 && "No results."}</p>
      )} */}
      </div>
      <br />
      <a
        href={encodeURI(
          `${activeLemmyInstance.baseUrl}search?q=${encodeURIComponent(
            handleSearchQuery()
          )}&type=${activeSearchType.value}&listingType=${
            activeListingType.value
          }&communityId=${
            activeCommunity?.counts?.community_id
          }&page=${currentSearchResultPage}&sort=${activeSortType.value}`
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        🔗 view in {activeLemmyInstance.baseUrl}
      </a>
      <BasedClientDetector />
    </>
  );
}