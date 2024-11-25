import { useCallback, useEffect, useState } from "react";
import AtlasOSMInfoCard from "./AtlasOSMInfoCard";

function AtlasOSMInfoList({
  listName,
  map,
  iconMap,
  filterKeys,
  data,
  activeAdministrativeRegion,
}) {
  const [lastMapBounds, setLastMapBounds] = useState(map.getBounds());
  const [activeElement, setActiveElement] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({}); // Store selected values for each filterKey

  const showOnMap = useCallback(
    (element) => {
      if (element.lat && element.lon) {
        map.flyTo([element.lat, element.lon], 15, { duration: 2.7 });
      } else if (element?.bounds) {
        map.flyToBounds(
          [
            [element.bounds.minlat, element.bounds.minlon],
            [element.bounds.maxlat, element.bounds.maxlon],
          ],
          { duration: 2.7 }
        );
      }
    },
    [map]
  );

  const handleClick = (element) => {
    if (element.lat && element.lon) {
      setLastMapBounds([
        [element.lat, element.lon],
        [element.lat, element.lon],
      ]);
    } else if (element?.bounds) {
      setLastMapBounds([
        [element.bounds.minlat, element.bounds.minlon],
        [element.bounds.maxlat, element.bounds.maxlon],
      ]);
    }
    if (element) setActiveElement(element);
    if (element === activeElement) setActiveElement(null);
    showOnMap(element);
  };

  const handleMouseEnter = (element) => {
    setLastMapBounds(map.getBounds());
    showOnMap(element);
  };

  const handleMouseLeave = () => {
    map.flyToBounds(lastMapBounds, { duration: 1.35 });
  };

  // Extract unique options for each filterKey from data
  const getFilterOptions = (key) => {
    const options = new Set();
    data?.elements.forEach((element) => {
      if (element?.tags[key]) {
        options.add(element?.tags[key]);
      }
    });
    return Array.from(options); // Convert Set to Array for dropdown
  };

  // Update selected filter for a specific key
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredData = data?.elements?.filter((element) => {
    return Object.entries(selectedFilters).every(([key, value]) => {
      if (!value) return true; // No filter applied for this key
      return element?.tags[key] === value; // Element must match the filter
    });
  });

  return (
    <div className="light">
      <div style={{ marginBottom: "1rem" }}>
        <h6>Filters for {listName}:</h6>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {filterKeys.map((key) => (
            <div key={key} style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={key} style={{ fontWeight: "bold" }}>
                {key}
              </label>
              <select
                id={key}
                value={selectedFilters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">All</option>
                {getFilterOptions(key).map((option, index) => (
                  <option key={index} value={option.toString()}>
                    {option.toString()}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {filteredData && (
        <h6>
          {filteredData.length} {listName} found in{" "}
          {activeAdministrativeRegion["country"]}
        </h6>
      )}
      <div className="overpass-list">
        {filteredData &&
          filteredData.map((element, index) => {
            return (
              <AtlasOSMInfoCard
                key={index}
                index={index}
                element={element}
                map={map}
                iconMap={iconMap}
                filterKeys={filterKeys}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleClick={handleClick}
                activeElement={activeElement}
              ></AtlasOSMInfoCard>
            );
          })}
      </div>
    </div>
  );
}

export default AtlasOSMInfoList;
