import { LemmyHttp, Login, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/dropdown-menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Comment from "./AtlasCommunityComment";

export default function AtlasCommunity({
  // Util
  isMobile,
  resetAtlas,

  // Location
  map,
  setMap,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  locationQuery,
  setLocationQuery,

  lemmyInstances,
  activeLemmyInstance,
  setActiveLemmyInstance,

  // Data
  activeIndicator,
  setActiveIndicator,

  // Community
  communityTypes,
  activeCommunityType,
  setActiveCommunityType,

  locationTypes,
  activeLocationType,
  setActiveLocationType,

  sortTypes,
  activeSortType,
  setActiveSortType,

  // Styles
  administrativeRegionStyle,
  administrativeRegionStyleHovered,
}) {
  const [countrySearchResult, setCountrySearchResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxResults, setMaxResults] = useState(false);

  /*
    Handlers
  */

  function handleSearchQuery() {
    switch (activeLocationType) {
      case "Combined":
        return `${locationQuery} ${activeAdministrativeRegion?.name} ${activeAdministrativeRegion?.country}`;
        break;
      case "Country":
        return `${locationQuery} ${activeAdministrativeRegion?.country}`;
        break;
      case "AdministrativeRegion":
        return `${locationQuery} ${activeAdministrativeRegion?.name}`;
        break;
      default:
        return `${locationQuery} ${activeAdministrativeRegion?.name} ${activeAdministrativeRegion?.country}`;
    }
  }

  // Event handler for "View More" button
  const handleViewMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const LocationQuery = () => {
    const handleSearch = (e) => {
      e.preventDefault();
      setLocationQuery(e.target.previousSibling.value);
    };

    return (
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="searchInput" className="sr-only">
          Query Selected Location
        </label>
        <input
          type="text"
          className="search-input"
          aria-label="Query Selected Location"
          placeholder="Query Selected Location"
        />

        <button
          className="search-button"
          type="submit"
          onClick={handleSearch}
          aria-label="Search"
        >
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
          </svg>
        </button>
      </form>
    );
  };

  /*
    useEffects
  */

  // Reset Query when location or location query is changed
  useEffect(() => {
    setCurrentPage(1);
    setMaxResults(false);
  }, [activeAdministrativeRegion, activeLocationType, locationQuery]);

  useEffect(() => {
    let client: LemmyHttp = new LemmyHttp(activeLemmyInstance?.baseUrl);

    let form: Search = {
      q: handleSearchQuery(),
      type_: "Comments",
      listing_type: "Local",
      community_id: activeLemmyInstance?.community_id, // /c/news
      page: currentPage,
      sort: activeSortType,
    };
    client.search(form).then((res) => {
      if (res.comments.length < 10) {
        setMaxResults(true);
      }
      // console.log(res.comments, "comments | response");

      setCountrySearchResult((prevResults) =>
        currentPage === 1 ? res.comments : [...prevResults, ...res.comments]
      );
    });
  }, [
    activeAdministrativeRegion,
    activeLemmyInstance,
    activeLocationType,
    activeSortType,
    currentPage,
    locationQuery,
  ]);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="icon-button" aria-label="Customise options">
            ☰
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-menu-content">
            <DropdownMenu.Item className="dropdown-menu-item">
              <div
                className="reset-container"
                role="button"
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
              value={activeLocationType}
              onValueChange={setActiveLocationType}
            >
              {locationTypes.map((type, index) => (
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
              Comments
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
      <LocationQuery />
      {/* <h5>{activeLemmyInstance.label}</h5> */}
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
        <button className="view-more" onClick={handleViewMore}>
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
          )}&type=Comments&listingType=Local&communityId=${
            activeLemmyInstance?.community_id
          }&page=1&sort=${activeSortType}`
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        view in {activeLemmyInstance.baseUrl}
      </a>
    </>
  );
}
