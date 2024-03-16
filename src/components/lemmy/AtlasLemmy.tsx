// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { ListCommunities, GetCommunity, LemmyHttp, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Comment from "./AtlasLemmyComment";
import Post from "./AtlasLemmyPost";
import LemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

import { searchTypes } from "../../Atlas_Config";
import AtlasLemmyCommunityInfoCard from "./AtlasLemmyCommunityInfoCard";

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
    switch (activeLocationType) {
      case "combined":
        return `${locationQuery} ${activeAdministrativeRegion["name"]} ${activeAdministrativeRegion["country"]}`;
        break;
      case "country":
        return `${locationQuery} ${activeAdministrativeRegion["country"]}`;
        break;
      case "name":
        return `${locationQuery} ${activeAdministrativeRegion["name"]}`;
        break;
      case "region":
        return `${locationQuery} ${activeAdministrativeRegion["region"]}`;
        break;

      case "sub-region":
        return `${locationQuery} ${activeAdministrativeRegion["sub-region"]}`;
        break;

      case "sub-region-code":
        return `${locationQuery} ${activeAdministrativeRegion["sub-region-code"]}`;
        break;

      case "intermediate-region":
        return `${locationQuery} ${activeAdministrativeRegion["intermediate-region"]}`;
        break;

      case "intermediate-region-code":
        return `${locationQuery} ${activeAdministrativeRegion["intermediate-region-code"]}`;
        break;

      case "alpha-2":
        return `${locationQuery} ${activeAdministrativeRegion["alpha-2"]}`;
        break;

      case "alpha-3":
        return `${locationQuery} ${activeAdministrativeRegion["alpha-3"]}`;
        break;

      case "iso_3166-2":
        return `${locationQuery} ${activeAdministrativeRegion["iso_3166-2"]}`;
        break;

      case "id":
        return `${locationQuery} ${activeAdministrativeRegion["id"]}`;
        break;

      default:
        return `${locationQuery} ${activeAdministrativeRegion["name"]} ${activeAdministrativeRegion["country"]}`;
    }
  }

  let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);
  let form: Search = {
    community_id: activeCommunity?.counts?.community_id,
    type_: activeSearchType,
    listing_type: activeListingType,
    sort: activeSortType,
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
      setPosts([]);
      setComments([]);

      if (activeSearchType === "Comments") {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments) setComments(res?.comments);
      }

      if (activeSearchType === "Posts") {
        setComments([]);
        if (res?.posts.length < 10) {
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts(res?.posts);
      }

      if (sideBarRef.current) sideBarRef.current.scrollTop = 0;
    });
  }

  function handleShowMore() {
    client.search(form).then((res) => {
      setPosts([]);
      setComments([]);

      if (activeSearchType === "Comments") {
        setPosts([]);
        if (res?.comments.length < 10) {
          setHasMore(false);
        }
        if (comments && res?.comments) setComments([...comments, ...res?.comments]);
      }

      if (activeSearchType === "Posts") {
        setComments([]);
        if (res?.posts.length < 10) {
          setHasMore(false);
        }
        if (posts && res?.posts) setPosts([...posts, ...res?.posts]);
      }
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
              {activeSearchType} by {activeSortType}
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
              value={activeLocationType}
              onValueChange={setActiveLocationType}
            >
              {regionTypes.map((type, index) => {
                if (!activeAdministrativeRegion[type]) return;
                return (
                  <DropdownMenu.RadioItem
                    key={index}
                    className="dropdown-menu-radio-item"
                    value={type}
                  >
                    <DropdownMenu.ItemIndicator className="dropdown-menu-itemIndicator">
                      ✔
                    </DropdownMenu.ItemIndicator>
                    {activeAdministrativeRegion[type]}
                  </DropdownMenu.RadioItem>
                );
              })}
            </DropdownMenu.RadioGroup>
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
      {comments && activeSearchType === "Comments" && (
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
      {posts && activeSearchType === "Posts" && (
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
      {true && (
        <button
          className="view-more"
          onClick={() => setCurrentSearchResultPage(currentSearchResultPage + 1)}
        >
          View More
        </button>
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
      </a>{" "}
      <BasedClientDetector />
    </>
  );
}
