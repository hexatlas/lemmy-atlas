import { useState } from "react";
import administrativeRegionsData from "./data/administrative_regions_extended.json";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { handleRandom } from "./hooks/useAtlasUtils";

/*

 /$$$$$$             /$$                          /$$$$$$                             
|_  $$_/            | $$                         /$$__  $$                            
  | $$   /$$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$ | $$  \__//$$$$$$   /$$$$$$$  /$$$$$$ 
  | $$  | $$__  $$|_  $$_/   /$$__  $$ /$$__  $$| $$$$   |____  $$ /$$_____/ /$$__  $$
  | $$  | $$  \ $$  | $$    | $$$$$$$$| $$  \__/| $$_/    /$$$$$$$| $$      | $$$$$$$$
  | $$  | $$  | $$  | $$ /$$| $$_____/| $$      | $$     /$$__  $$| $$      | $$_____/
 /$$$$$$| $$  | $$  |  $$$$/|  $$$$$$$| $$      | $$    |  $$$$$$$|  $$$$$$$|  $$$$$$$
|______/|__/  |__/   \___/   \_______/|__/      |__/     \_______/ \_______/ \_______/
                                                                                      
                                                                                                                                                                            
*/

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
  activeLocationType,
  setActiveLocationType,

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
      className="map-interface-container"
      open={open}
      onOpenChange={setOpen}
    >
      <div className="right-slot">
        <Collapsible.Trigger className="map-interface-container-collapse-trigger">
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
          {regionTypes.map((type) => {
            if (activeAdministrativeRegion[type] === "") return;
            if (type === "id") return;
            if (type === "iso_3166-2") return;
            if (type === "country-code") return;
            if (type === "sub-region-code") return;
            if (type === "intermediate-region-code") return;
            if (type === "combined") return;

            return (
              <p
                className={`country-name country-${type} ${
                  activeLocationType === type && "active-location-type"
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Select ${activeAdministrativeRegion[type]}`}
                onClick={() => setActiveLocationType(type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Space") {
                    setActiveLocationType(regionTypes[type]);
                  }
                }}
              >
                {activeAdministrativeRegion[type]}
              </p>
            );
          })}
        </>
      )}
      <Collapsible.Content>
        {activeAdministrativeRegion.country !== "country" && (
          <>
            <div className="administrative-region-flag-container">
              <img
                className="administrative-region-flag"
                src={activeAdministrativeRegion.image}
                alt={`Flag of ${activeAdministrativeRegion.country}`}
              />
            </div>
            <h1
              className={`country-administrative-region ${
                activeLocationType === "name" && "active-location-type"
              }`}
              role="button"
              aria-label={`Select ${activeAdministrativeRegion.name}`}
              tabIndex={0}
              onClick={() => setActiveLocationType(regionTypes[0])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space") {
                  setActiveLocationType(regionTypes[1]);
                }
              }}
            >
              {activeAdministrativeRegion.name}
            </h1>
            <h5
              className={`country-name ${
                activeLocationType === "country" && "active-location-type"
              }`}
              role="button"
              aria-label={`Select ${activeAdministrativeRegion.country}`}
              tabIndex={0}
              onClick={() => setActiveLocationType(regionTypes[1])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Space") {
                  setActiveLocationType(regionTypes[0]);
                }
              }}
            >
              {activeAdministrativeRegion.country}
            </h5>
            {regionTypes.map((type) => {
              if (activeAdministrativeRegion[type] === "") return;
              if (type === "country") return;
              if (type === "name") return;
              if (type === "id") return;
              if (type === "iso_3166-2") return;
              if (type === "country-code") return;
              if (type === "sub-region-code") return;
              if (type === "intermediate-region-code") return;
              if (type === "combined") return;

              return (
                <p
                  className={`country-name country-${type} ${
                    activeLocationType === type && "active-location-type"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${activeAdministrativeRegion[type]}`}
                  onClick={() => setActiveLocationType(type)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Space") {
                      setActiveLocationType(regionTypes[type]);
                    }
                  }}
                >
                  {activeAdministrativeRegion[type]}
                </p>
              );
            })}
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
              if (index === 0 || index > 5 || adminregion.country === "country") return;
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
