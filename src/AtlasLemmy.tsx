// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { ListCommunities, GetCommunity, LemmyHttp, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Comment from "./AtlasLemmyComment";
import Post from "./AtlasLemmyPost";
import LemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

import { searchTypes } from "./Atlas_Config";
import AtlasLemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

export default function AtlasLemmy({
  // Util
  isMobile,
  resetAtlas,
  tabsContentRef,

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
  const [communityList, setCommunityList] = useState(null);
  const [currentCommunityPage, setCurrentCommunityPage] = useState<number>(1);
  const [hasMoreCommunities, setHasMoreCommunities] = useState<boolean>(true);

  const [regionSearchResult, setRegionSearchResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSearchResultPage, setCurrentSearchResultPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  /*
    Handlers
  */

  function handleSearchQuery() {
    switch (activeRegionType) {
      case "Combined":
        return `${locationQuery} ${
          activeAdministrativeRegion?.name == "Administrative Region"
            ? ""
            : activeAdministrativeRegion?.name
        } ${
          activeAdministrativeRegion?.country == "Country"
            ? ""
            : activeAdministrativeRegion?.country
        }`;
        break;
      case "Country":
        return `${locationQuery} ${
          activeAdministrativeRegion?.country == "Country"
            ? ""
            : activeAdministrativeRegion?.country
        }`;
        break;
      case "AdministrativeRegion":
        return `${locationQuery} ${
          activeAdministrativeRegion?.name == "Administrative Region"
            ? ""
            : activeAdministrativeRegion?.name
        }`;
        break;
      default:
        return `${locationQuery} ${
          activeAdministrativeRegion?.name == "Administrative Region"
            ? ""
            : activeAdministrativeRegion?.name
        } ${
          activeAdministrativeRegion?.country == "Country"
            ? ""
            : activeAdministrativeRegion?.country
        }`;
    }
  }

  let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);

  function handleCommunityRefresh() {
    if (locationQuery) {
      setCurrentCommunityPage(1);
      handleSearchCommunities(locationQuery);
    } else {
      handleCommunityList();
    }

    let form: Search = {
      community_id: activeCommunity?.counts?.community_id,
      type_: activeSearchType,
      listing_type: activeListingType,
      sort: activeSortType,
      q: handleSearchQuery(),
      page: currentSearchResultPage,
    };

    client.search(form).then((res) => {
      console.log(res);

      if (
        (activeSearchType === "Comments" && res?.comments.length < 10) ||
        (activeSearchType === "Posts" && res?.posts.length < 10)
      ) {
        setHasMore(false);
      }
      console.log(comments, "commen");

      if (res?.comments) setComments([...res?.comments]);

      if (res?.posts) setPosts([...res?.posts]);

      // setRegionSearchResult(res);

      if (tabsContentRef.current) tabsContentRef.current.scrollTop = 0;
    });
  }

  // Gets list of communites from active lemmy instance
  function handleCommunityList() {
    let form: ListCommunities = {
      type_: activeListingType,
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
      listing_type: activeListingType,
    };

    client.search(form).then((res) => {
      setCommunityList(res?.communities);
    });
  }

  const handleScroll = () => {
    // Check if user has scrolled to the bottom
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      // Fetch more comments if there are more to fetch
      if (hasMore) {
        // fetchComments();
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

  //  init

  // Reset Query when location or location query is changed
  useEffect(() => {
    setComments(null);
    setPosts(null);
    setCurrentSearchResultPage(1);
    setHasMore(false);
  }, [activeAdministrativeRegion, activeRegionType, activeSearchType, locationQuery]);

  // Reset when Lemmy Instance is changed
  useEffect(() => {
    setComments(null);
    setPosts(null);
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
      handleCommunityRefresh();
    }, 1312);
    return () => clearTimeout(debounce);
  }, [
    activeAdministrativeRegion,
    activeRegionType,
    activeLemmyInstance,
    activeCommunity,
    activeListingType,
    activeSortType,
    activeSearchType,
    currentSearchResultPage,
    locationQuery,
  ]);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="icon-button" aria-label="Community Settings Menu">
            ☰
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-menu-content">
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
              {activeSearchType}
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
                        {sort}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            <DropdownMenu.Label className="dropdown-menu-label">
              Location
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={activeRegionType}
              onValueChange={setActiveRegionType}
            >
              {regionTypes.map((type, index) => (
                <DropdownMenu.RadioItem
                  key={index}
                  className="dropdown-menu-radio-item"
                  value={type}
                >
                  <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                    ✔
                  </DropdownMenu.ItemIndicator>
                  {type === "AdministrativeRegion" && activeAdministrativeRegion.name}
                  {type === "Country" && activeAdministrativeRegion.country}
                  {type === "Combined" && "Combined Search"}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Separator className="dropdown-menu-separator" />
            <DropdownMenu.Label className="dropdown-menu-label">
              Search
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={activeSearchType}
              onValueChange={setActiveSearchType}
            >
              {searchTypes.map((sort, index) => (
                <DropdownMenu.RadioItem
                  key={index}
                  className="dropdown-menu-radio-item"
                  value={sort}
                  // disabled={index != 1}
                >
                  <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                    ✔
                  </DropdownMenu.ItemIndicator>
                  {sort}
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
              {listingTypes.map((sort, index) => (
                <DropdownMenu.RadioItem
                  key={index}
                  className="dropdown-menu-radio-item"
                  value={sort}
                  disabled={index > 1}
                >
                  <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                    ✔
                  </DropdownMenu.ItemIndicator>
                  {sort}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {activeCommunity && activeCommunity?.community?.banner && (
        <img
          className="banner-image"
          src={activeCommunity?.community?.banner}
          alt={`${activeCommunity?.community?.name} Community Banner`}
        />
      )}

      {activeCommunity?.community && (
        <LemmyCommunityInfoCard
          lemmyInstance={activeLemmyInstance}
          community={activeCommunity?.community}
          sort={activeSortType}
        >
          <button className="icon-button" aria-label={"Show Community Information"}>
            ⓘ
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
                onClick={() => setActiveCommunity(community)}
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
      {locationQuery && (
        <div className="community-querylocation">
          <h3>
            <i>{locationQuery}</i>
          </h3>
          <h5>
            {activeAdministrativeRegion.name}, <br />
            {activeAdministrativeRegion.country}
          </h5>
        </div>
      )}
      {comments && (
        <div className="post-reply-container">
          {comments.length > 0 &&
            comments.map(
              (comment, index) =>
                comment?.comment?.removed ||
                comment?.comment?.deleted || (
                  <Comment
                    key={`${comment?.comment.id}${index}`}
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

      {posts && (
        <div className="post-reply-container">
          {posts.length > 0 &&
            posts.map((post, index) => (
              <Post
                key={`${post?.post.id}${index}`}
                post={post}
                community={activeCommunity}
                lemmyInstance={activeLemmyInstance}
                sort={activeSortType}
              />
            ))}
        </div>
      )}

      {/* {activeSearchType === "Posts" && regionSearchResult && (
        <p>{regionSearchResult.posts === 0 && "No results."}</p>
      )} */}
      <a
        href={encodeURI(
          `${activeLemmyInstance.baseUrl}search?q=${encodeURIComponent(
            handleSearchQuery()
          )}&type=${activeSearchType}&listingType=${activeListingType}&communityId=${
            activeCommunity?.counts?.community_id
          }&page=${currentSearchResultPage}&sort=${activeSortType}`
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        view in {activeLemmyInstance.baseUrl}
      </a>
    </>
  );
}
