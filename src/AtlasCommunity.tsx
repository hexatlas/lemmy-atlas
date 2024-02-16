// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import { ListCommunities, GetCommunity, LemmyHttp, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Comment from "./AtlasCommunityComment";
import { searchTypes } from "./Atlas_Config";

export default function AtlasCommunity({
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
  const [communityList, setCommunityList] = useState(null);
  const [countrySearchResult, setCountrySearchResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxResults, setMaxResults] = useState(false);

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
      handleSearchCommunity(locationQuery);
    } else {
      handleCommunityList();
    }

    let form: Search = {
      community_id: activeCommunity?.counts?.community_id,
      type_: activeSearchType,
      listing_type: activeListingType,
      sort: activeSortType,
      q: handleSearchQuery(),
      page: currentPage,
    };

    client.search(form).then((res) => {
      if (res.comments.length < 10) {
        setMaxResults(true);
      }
      console.log(res, "handleCommunityRefresh | AtlasCommuntiy");

      setCountrySearchResult((prevResults) =>
        currentPage === 1 ? res.comments : [...prevResults, ...res.comments]
      );
    });
  }

  // Gets list of communites from active lemmy instance
  function handleCommunityList(isInitial = false) {
    let form: ListCommunities = {
      type_: activeListingType,
      sort: "TopAll",
      // sort: isInitial ? "TopAll" : activeSortType,
    };

    client.listCommunities(form).then((res) => {
      console.log(res, "handleCommunityList | response");
      setCommunityList(res?.communities);
    });
  }

  function handleSearchCommunity(searchQuery) {
    let form: Search = {
      q: searchQuery,
      type_: "Communities",
      listing_type: activeListingType,
    };

    client.search(form).then((res) => {
      console.log(res?.communities, "handleSearchCommunity");
      setCommunityList(res?.communities);
    });
  }

  // Event handler for "View More" button
  const handleViewMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLocationQuery(e.target.value);
  };

  /*
    useEffects
  */

  // Reset Query when location or location query is changed
  useEffect(() => {
    setCurrentPage(1);
    setMaxResults(false);
  }, [activeAdministrativeRegion, activeRegionType, locationQuery]);

  useEffect(() => {
    setActiveCommunity(null);
    handleCommunityList(true);
  }, [activeLemmyInstance]);

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
    currentPage,
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
            <DropdownMenu.Separator className="dropdown-menu-separator" />
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
                  {type}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
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
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                Listing
                <div className="right-slot">▸</div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent className="dropdown-menu-subcontent">
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
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                Search
                <div className="right-slot">▸</div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent className="dropdown-menu-subcontent">
                  <DropdownMenu.RadioGroup
                    value={activeSearchType}
                    onValueChange={setActiveSearchType}
                  >
                    {searchTypes.map((sort, index) => (
                      <DropdownMenu.RadioItem
                        key={index}
                        className="dropdown-menu-radio-item"
                        value={sort}
                        disabled={index != 1}
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
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="dropdown-menu-subtrigger">
                Ideology
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
            <DropdownMenu.Arrow className="dropdown-menu-arrow" />
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

      {activeCommunity && (
        <a
          href={activeCommunity?.community?.actor_id}
          target="_blank"
          rel="noopener noreferrer"
        >
          {activeCommunity?.community?.name}
        </a>
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
      {countrySearchResult ? (
        <div className="comment-reply-container">
          {countrySearchResult.map((post, index) => (
            <Comment
              key={`${post?.comment.id}${index}`}
              post={post}
              community={activeCommunity}
              lemmyInstance={activeLemmyInstance}
              sort={activeSortType}
              ratioDetector={undefined}
            />
          ))}
        </div>
      ) : (
        <p>Loading</p>
      )}
      {/* Show View More Button only when there */}
      {countrySearchResult && !maxResults ? (
        <button
          role="button"
          className="view-more"
          onClick={handleViewMore}
          aria-label="View More Comments"
        >
          View More
        </button>
      ) : (
        <p>No more results.</p>
      )}
      <p>{countrySearchResult === 0 && "No results."}</p>
      <a
        href={encodeURI(
          `${activeLemmyInstance.baseUrl}search?q=${encodeURIComponent(
            handleSearchQuery()
          )}&type=${activeSearchType}&listingType=${activeListingType}&communityId=${
            activeLemmyInstance?.community_id
          }&page=${currentPage}&sort=${activeSortType}`
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        view in {activeLemmyInstance.baseUrl}
      </a>
    </>
  );
}
