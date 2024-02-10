import { LemmyHttp, Login, Search } from "lemmy-js-client";
import { useEffect, useState } from "react";

import administrativeRegionsData from "./data/provinces_optimized.json";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function AtlasInterface({
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
            (regex.test(item.properties.country) ||
              regex.test(item.properties.name))
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
          placeholder="Search Country or AdministrativeRegion"
          value={searchTerm}
          onChange={handleChange}
        />
        {(searchTerm.trim() !== "" || searchResults.length > 0) && (
          <ul className="search-results">
            {searchResults.map((result, index) => (
              <li key={`${result.properties.id}${index}`}>
                <button onClick={() => handleSelectResult(result)}>
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
    <div id="country-search">
      <LocationSearch
        data={administrativeRegionsData.features}
        setActiveAdministrativeRegion={setActiveAdministrativeRegion}
      />
    </div>
  );
}
