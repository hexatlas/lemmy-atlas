import React, { useCallback, useState } from 'react';
import AtlasOSMInfoCard from './OSMInfoCard';

import { OSMInfoListProps } from '../../types/atlas.types';
import { LatLngBoundsExpression } from 'leaflet';

function AtlasOSMInfoList({
  listName,
  map,
  iconMap,
  filterKeys,
  data,
  activeAdministrativeRegion,
}: OSMInfoListProps) {
  const [lastMapBounds, setLastMapBounds] = useState<
    LatLngBoundsExpression | undefined
  >(map?.getBounds());
  const [activeElement, setActiveElement] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({}); // Store selected values for each filterKey

  const showOnMap = useCallback(
    (element) => {
      if (element.lat && element.lon) {
        map?.flyTo([element.lat, element.lon], 15, { duration: 2.7 });
      } else if (element?.bounds) {
        map?.flyToBounds(
          [
            [element.bounds.minlat, element.bounds.minlon],
            [element.bounds.maxlat, element.bounds.maxlon],
          ],
          { duration: 2.7 },
        );
      }
    },
    [map],
  );

  const handleClick = (element) => {
    if (element.lat && element.lon) {
      setLastMapBounds([
        [element.lat, element.lon],
        [element.lat, element.lon],
      ] as LatLngBoundsExpression);
    } else if (element?.bounds) {
      setLastMapBounds([
        [element.bounds.minlat, element.bounds.minlon],
        [element.bounds.maxlat, element.bounds.maxlon],
      ] as LatLngBoundsExpression);
    }
    if (element) setActiveElement(element);
    if (element === activeElement) setActiveElement(null);
    showOnMap(element);
  };

  const handleMouseEnter = (element) => {
    setLastMapBounds(map?.getBounds());
    showOnMap(element);
  };

  const handleMouseLeave = () => {
    map?.flyToBounds(lastMapBounds as LatLngBoundsExpression, {
      duration: 1.35,
    });
  };

  // Extract unique options for each filterKey from data
  const getFilterOptions = (key) => {
    const options = new Set();
    data?.elements.forEach((element) => {
      if (element?.tags[key]) {
        options.add(element?.tags[key]);
      }
    });
    return Array.from(options).sort(); // Convert Set to Array for dropdown
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
    <>
      {filteredData && (
        <>
          <div className="filter-title">
            <h5>
              <span>
                {filteredData.length} {listName}
              </span>{' '}
              found in {activeAdministrativeRegion['country']}
            </h5>
          </div>
          <div
            className="filter-menu"
            aria-label={`Filter options ${listName}`}
            role="toolbar"
          >
            {filterKeys &&
              filterKeys.map((key, index) => (
                <div
                  key={index}
                  className="filter-field"
                  aria-label={`${key} filter option`}
                >
                  <label htmlFor={key} className="sr-only">
                    {key}
                  </label>
                  <select
                    id={key}
                    value={selectedFilters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    aria-controls="overpass-list"
                  >
                    <option value="">{key}</option>
                    {getFilterOptions(key).map((option: string, index) => (
                      <option key={index} value={option.toString()}>
                        {option.toString()}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>{' '}
        </>
      )}

      <div
        className="overpass-list"
        role="list"
        aria-label={`${listName} in ${activeAdministrativeRegion['country']}`}
        aria-description={`List of ${listName} in ${activeAdministrativeRegion['country']}`}
        aria-live="polite"
        id="overpass-list"
      >
        {filteredData &&
          filteredData.map((element, index) => {
            return (
              <AtlasOSMInfoCard
                key={index}
                index={index}
                element={element}
                // map={map}
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
    </>
  );
}

export default AtlasOSMInfoList;
