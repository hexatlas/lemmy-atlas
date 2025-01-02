import React, { useCallback, useState } from 'react';
// https://www.radix-ui.com/primitives/docs/components/accordion
import * as Accordion from '@radix-ui/react-accordion';

// https://www.radix-ui.com/primitives/docs/components/accordion
import * as Collapsible from '@radix-ui/react-collapsible';

import AtlasOSMInfoCard from './OSMInfoCard';

import { OSMInfoListProps } from '../../types/atlas.types';
import { LatLngBoundsExpression } from 'leaflet';
import { ReactNode } from '@tanstack/react-router';

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
        <Collapsible.Root>
          <h5>
            <span>{listName} </span>
            found in {activeAdministrativeRegion['country']}
          </h5>
          <p>
            {' '}
            {filteredData.length}{' '}
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (!value) return true; // No filter applied for this key
              return `${
                iconMap && iconMap[value as string] != undefined
                  ? (iconMap[value as string]?.options?.html as ReactNode)
                  : ''
              } ${value} `; // Element must match the filter
            })}{' '}
          </p>
          <Collapsible.Trigger className="filter-title emoji-label">
            🎚️
          </Collapsible.Trigger>
          <Collapsible.Content
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
                    {getFilterOptions(key).length}
                  </label>
                  <select
                    id={key}
                    value={selectedFilters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    aria-controls="overpass-list"
                  >
                    <option
                      value=""
                      className="filter-field-reset"
                      defaultChecked
                    >
                      ({getFilterOptions(key).length}) {key}
                    </option>
                    {getFilterOptions(key).map((option: string, index) => (
                      <option key={index} value={option.toString()}>
                        {iconMap &&
                          (iconMap[option]?.options?.html as ReactNode)}{' '}
                        {option.toString()}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </Collapsible.Content>{' '}
        </Collapsible.Root>
      )}

      <Accordion.Root
        type="multiple"
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
      </Accordion.Root>
    </>
  );
}

export default AtlasOSMInfoList;
