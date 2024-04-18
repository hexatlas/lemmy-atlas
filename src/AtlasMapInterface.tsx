import { useEffect, useState } from "react";
import administrativeRegionsData from "./data/administrative_regions_extended.json";

// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { handleRandom } from "./hooks/useAtlasUtils";

import { latLng, latLngBounds } from "leaflet";

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

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  nominatim,
  setNominatim,

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

  const LocationSearch = ({ data, children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [activeSearchResult, setActiveSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const debounce = setTimeout(() => {
        if (searchTerm.trim() !== "") handleSearch();
      }, 1312);
      return () => clearTimeout(debounce);
    }, [searchTerm]);

    useEffect(() => {
      handleLookUp();
    }, [activeSearchResult]);

    const handleSearch = async () => {
      try {
        if (searchTerm.trim() !== "") {
          const url = `/.netlify/functions/nominatim/?query=${encodeURI(
            searchTerm
          )}&endpoint=search&format=json&country=${
            activeAdministrativeRegion["alpha-2"]
          }`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          console.log(result, "handleSearch");
          setSearchResults(result);
          setLoading(false);
        }
      } catch (error) {
        console.error("Invalid regular expression:", error.message);
        setSearchResults([]);
      }
    };

    const handleLookUp = async () => {
      try {
        if (searchTerm.trim() !== "") {
          const url = `/.netlify/functions/nominatim/?query=${encodeURI(
            searchTerm
          )}&endpoint=lookup&osm_ids=${activeSearchResult.osm_type[0]}${
            activeSearchResult.osm_id
          }&format=geojson`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          console.log(result, "handleLookUp result");
          console.log(result.features[0].properties.address.country_code.toUpperCase());

          const matchedGeoJSon = data.find(
            (adminstrativeRegion) =>
              adminstrativeRegion.properties["alpha-2"] ===
              result.features[0].properties.address.country_code.toUpperCase()
          );
          matchedGeoJSon.properties.name = result.features[0].properties.name;
          console.log(matchedGeoJSon, "handleLookUp matchedGeoJSon");

          setActiveLocationType("name");
          setActiveAdministrativeRegion(matchedGeoJSon.properties);
          setNominatim(result);
          setIsOpenAtlasMapInterface(false);
        }
      } catch (error) {
        console.error("Invalid regular expression:", error.message);
        setSearchResults([]);
      }
    };

    const handleSearchInputChange = (e) => {
      const query = e.target.value;
      setLoading(true);
      setSearchTerm(query);
    };

    const handleCLickSearchResult = (result) => {
      let corner1 = latLng(result.boundingbox[0], result.boundingbox[2]);
      let corner2 = latLng(result.boundingbox[1], result.boundingbox[3]);
      let bounds = latLngBounds(corner1, corner2);
      map?.fitBounds(bounds);

      console.log(result, "handleCLickSearchResult");
      setActiveSearchResult(result);
    };

    return (
      <div id="location-search">
        {!isMobile && (
          <div className="right-slot">
            <button
              role="button"
              title="Click and Drag to Resize"
              aria-label="Resize Button. Click and Drag to Resize"
              className="legend-resize-button"
              onMouseDown={handleNexusResize}
            >
              ↔
            </button>
          </div>
        )}
        <div className="search-input-wrapper">
          {children}
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
          <div className="search-form">
            <label htmlFor="search-input" className="sr-only">
              Search Location in {activeAdministrativeRegion.country}
            </label>
            <input
              className="search-input"
              type="text"
              placeholder={`Search Location ${
                activeAdministrativeRegion.country !== "country"
                  ? `in ${activeAdministrativeRegion.country}`
                  : ""
              }`}
              aria-label={`Search Location ${
                activeAdministrativeRegion.country !== "country"
                  ? `in ${activeAdministrativeRegion.country}`
                  : ""
              }`}
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        {(searchTerm.trim() !== "" || searchResults.length > 0) && (
          <ul className="search-results">
            {loading && <p className="search-loading-icon">🔍</p>}
            {searchResults.map((result, index) => (
              <li key={result.place_id}>
                <button
                  onClick={() => handleCLickSearchResult(result)}
                  role="button"
                  aria-label={`Select ${result.display_name}`}
                >
                  {result.display_name}
                </button>
              </li>
            ))}
            {!loading && searchResults.length <= 0 && <p>🪹</p>}
            <small className="search-licence">{searchResults[0]?.licence}</small>
          </ul>
        )}
      </div>
    );
  };

  return (
    <Collapsible.Root
      className="map-interface-container"
      open={isOpenAtlasMapInterface}
      onOpenChange={setIsOpenAtlasMapInterface}
    >
      <LocationSearch data={administrativeRegionsData.features}>
        {activeAdministrativeRegion.country === "country" ? (
          <button
            role="button"
            title="Select Random Administrative Region"
            aria-label="Random Button - Select Random Administrative Region"
            className="button-icon atlas-reset-button"
            onClick={() => handleRandom(setActiveAdministrativeRegion)}
          >
            🎲
          </button>
        ) : (
          <Collapsible.Trigger asChild>
            <button
              className="button-icon atlas-reset-button"
              title="Click to Expand and Collapse"
            >
              {isMobile ? "☰" : isOpenAtlasMapInterface ? "⊟" : "⊞"}
            </button>
          </Collapsible.Trigger>
        )}
      </LocationSearch>

      <Collapsible.Content>
        {activeAdministrativeRegion.country !== "country" && (
          <>
            <div className="right-slot">
              <button
                role="button"
                title="Select Random Administrative Region"
                aria-label="Random Button - Select Random Administrative Region"
                className="random-button"
                onClick={() => handleRandom(setActiveAdministrativeRegion)}
              >
                🎲
              </button>
            </div>
            {!isMobile && (
              <div className="administrative-region-flag-container">
                <img
                  className="administrative-region-flag"
                  src={activeAdministrativeRegion.image}
                  alt={`Flag of ${activeAdministrativeRegion.country}`}
                />
              </div>
            )}
            <h1
              className={`location-name ${
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
            {regionTypes.map((type, index) => {
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
                  key={index}
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
        {administrativeRegionClickHistoryArray.length > 2 && (
          <div className="location-name-click-history">
            {administrativeRegionClickHistoryArray.map((adminregion, index) => {
              if (index === 0 || index > 5 || adminregion.country === "country") return;
              return (
                <div
                  key={index}
                  className="location-name-click-history-item"
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
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
