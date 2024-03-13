import { useState } from "react";
import administrativeRegionsData from "./data/administrative_regions_extended.json";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { handleRandom } from "./hooks/useAtlasUtils";

export default function AtlasInterface({
  // Util
  isMobile,
  resetAtlas,

  nexusSize,
  setNexusSize,

  // Location
  map,
  setMap,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

  lemmyInstances,
  activeLemmyInstance,
  setActiveLemmyInstance,

  // Data
  activeIndicator,
  setActiveIndicator,

  // Community
  listingTypes,
  activeListingType,
  setActiveListingType,

  regionTypes,
  activeRegionType,
  setActiveRegionType,

  sortTypes,
  activeSortType,
  setActiveSortType,

  // Styles
  administrativeRegionStyle,
  administrativeRegionStyleHovered,
}) {
  /*
      useStates 
  */

  const [open, setOpen] = useState(true);

  /* 
      Handlers
   */
  const handleNexusResize = (mouseDownEvent) => {
    const startSize = nexusSize;
    const startPosition = mouseDownEvent.pageX;

    function onMouseMove(mouseMoveEvent) {
      setNexusSize(document.body.clientWidth - mouseMoveEvent.clientX);
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  /*
    Component
  */
  const LocationSearch = ({ data, setActiveAdministrativeRegion }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
      try {
        const regex = new RegExp(query, "i");
        const filteredResults = data.filter(
          (item) =>
            item.properties &&
            item.properties.country &&
            item.properties.name &&
            (regex.test(item.properties.country) || regex.test(item.properties.name))
        );
        setSearchResults(filteredResults.slice(0, 20));
      } catch (error) {
        console.error("Invalid regular expression:", error.message);
        setSearchResults([]);
      }
    };

    const handleSelectResult = (result) => {
      setActiveAdministrativeRegion(result.properties);
      setSearchTerm(`${result.properties.name} - ${result.properties.country}`);
      setSearchResults([]); // Clear search results after selecting
    };

    const handleChange = (e) => {
      const query = e.target.value;
      setSearchTerm(query);
      if (query.trim() === "") {
        setSearchResults([]); // Clear results when input is empty
      } else {
        handleSearch(query);
      }
    };

    return (
      <>
        <input
          className="search-input"
          type="text"
          placeholder="Search Country or Administrative Region"
          aria-label="Search Country or Administrative Region"
          value={searchTerm}
          onChange={handleChange}
        />
        {(searchTerm.trim() !== "" || searchResults.length > 0) && (
          <ul className="search-results">
            {searchResults.map((result, index) => (
              <li key={`${result.properties.id}${index}`}>
                <button
                  onClick={() => handleSelectResult(result)}
                  role="button"
                  aria-label={`Select ${result.properties.name} Region in ${result.properties.country}`}
                >
                  {result.properties.name} - {result.properties.country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <Collapsible.Root
      className="active-country-container"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="right-slot">
        <Collapsible.Trigger className="active-country-container-collapse-trigger">
          <div title="Click to Expand and Collapse">{open ? "⊟" : "⊞"}</div>
        </Collapsible.Trigger>
        {!isMobile && (
          <button
            role="button"
            title="Click and Drag to Resize"
            aria-label="Resize Button. Click and Drag to Resize"
            className="windows-resize-button"
            onMouseDown={handleNexusResize}
          >
            ↔
          </button>
        )}{" "}
        <button
          role="button"
          title="Select Random Administrative Region"
          aria-label="Random Button - Select Random Administrative Region"
          className="random-button"
          onClick={() => handleRandom(setActiveAdministrativeRegion)}
        >
          🎲
        </button>
        <button
          role="button"
          title="Reset Atlas to default settings"
          aria-label="Reset Atlas Settings to default settings"
          className="reset-button"
          onClick={resetAtlas}
        >
          ⟲
        </button>
      </div>
      {!open && (
        <>
          <h2
            className={`country-administrative-region ${
              activeRegionType === "AdministrativeRegion" && "active-location-type"
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Select ${activeAdministrativeRegion.name}`}
            onClick={() => setActiveRegionType(regionTypes[1])}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Space") {
                setActiveRegionType(regionTypes[1]);
              }
            }}
          >
            {activeAdministrativeRegion.name}
          </h2>
          <h6
            className={`country-name ${
              activeRegionType === "Country" && "active-location-type"
            }`}
            role="button"
            aria-label={`Select ${activeAdministrativeRegion.country}`}
            tabIndex={0}
            onClick={() => setActiveRegionType(regionTypes[0])}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Space") {
                setActiveRegionType(regionTypes[0]);
              }
            }}
          >
            {activeAdministrativeRegion.country}
          </h6>{" "}
          <p className="region-name">
            {activeAdministrativeRegion["intermediate-region"]}
          </p>
          <p className="region-name">{activeAdministrativeRegion["sub-region"]}</p>
          <p className="region-name">{activeAdministrativeRegion.region}</p>
        </>
      )}
      <Collapsible.Content>
        {activeAdministrativeRegion.country !== "Country" && (
          <>
            <h1
              className={`country-administrative-region ${
                activeRegionType === "AdministrativeRegion" && "active-location-type"
              }`}
              role="button"
              aria-label={`Select ${activeAdministrativeRegion.name}`}
              tabIndex={0}
              onClick={() => setActiveRegionType(regionTypes[1])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space") {
                  setActiveRegionType(regionTypes[1]);
                }
              }}
            >
              {activeAdministrativeRegion.name}
            </h1>
            <h5
              className={`country-name ${
                activeRegionType === "Country" && "active-location-type"
              }`}
              role="button"
              aria-label={`Select ${activeAdministrativeRegion.country}`}
              tabIndex={0}
              onClick={() => setActiveRegionType(regionTypes[0])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space") {
                  setActiveRegionType(regionTypes[0]);
                }
              }}
            >
              {activeAdministrativeRegion.country}
            </h5>
            <p className="region-name">
              {activeAdministrativeRegion["intermediate-region"]}
            </p>
            <p className="region-name">{activeAdministrativeRegion["sub-region"]}</p>
            <p className="region-name">{activeAdministrativeRegion.region}</p>
          </>
        )}

        <div id="country-search">
          <LocationSearch
            data={administrativeRegionsData.features}
            setActiveAdministrativeRegion={setActiveAdministrativeRegion}
          />{" "}
        </div>
        <div className="country-administrative-region-click-history">
          {administrativeRegionClickHistoryArray &&
            administrativeRegionClickHistoryArray.map((adminregion, index) => {
              if (index === 0 || index > 5 || adminregion.country === "Country") return;
              return (
                <div
                  key={index}
                  className="country-administrative-region-click-history-item"
                  aria-label={`Select ${activeAdministrativeRegion.name} in ${activeAdministrativeRegion.country}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveAdministrativeRegion(adminregion)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Space") {
                      setActiveAdministrativeRegion(adminregion);
                    }
                  }}
                >
                  <h2>{adminregion.name}</h2>
                  <h6>{adminregion.country}</h6>
                </div>
              );
            })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
