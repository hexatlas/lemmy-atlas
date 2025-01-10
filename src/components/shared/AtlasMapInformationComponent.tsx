import React, { useContext, useEffect, useState } from 'react';
// https://www.radix-ui.com/primitives/docs/components/accordion
import * as Collapsible from '@radix-ui/react-collapsible';
import { ReactNode } from '@tanstack/react-router';
import { AtlasContext } from '../../routes/__root';
import useOverpassLayer from '../../data/shared/useOverpassLayer';
import LegendLayout from './AtlasLegendLayout';
import AtlasOSMSettings from './OSMSettings';
import AtlasOSMInfoList from './OSMInfoList';

function MapInformationComponent({
  name,
  useMapInformation,
  filterKeys,
  iconMap,
  route,
}: {
  name: string;
  useMapInformation;
  filterKeys;
  iconMap;
  route;
}) {
  const {
    // Location
    map,
    activeAdministrativeRegion,
    isClustered,
    setIsClustered,
  } = useContext(AtlasContext)!;
  const { data, isLoading } = useMapInformation(activeAdministrativeRegion);

  const [selectedFilters, setSelectedFilters] = useState({}); // Store selected values for each filterKey
  const filteredData = data?.elements?.filter((element) => {
    return Object.entries(selectedFilters).every(([key, value]) => {
      if (!value) return true; // No filter applied for this key
      return element?.tags[key] === value; // Element must match the filter
    });
  });

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        filteredData,
        iconMap,
        filterKeys[0], // first filterkey is used set emojis on map
        isClustered,
      );
    }
    return () => {
      if (layerObjects) {
        map?.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, filteredData, isClustered]);

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

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <LegendLayout route={route}>
      <AtlasOSMSettings {...clusterSettings} />
      {isLoading && <p className="map-info__loading-emoji">🔍</p>}
      {data && (
        <Collapsible.Root>
          <h5>
            <span>{name} </span>
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
            aria-label={`Filter options ${name}`}
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
                    aria-controls="list"
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
      {filteredData && (
        <AtlasOSMInfoList
          listName={name}
          map={map}
          data={filteredData}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={filterKeys}
        ></AtlasOSMInfoList>
      )}
    </LegendLayout>
  );
}

export default MapInformationComponent;
