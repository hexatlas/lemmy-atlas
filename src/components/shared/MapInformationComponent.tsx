import React, { useContext, useEffect, useState } from 'react';

import { AtlasContext } from '../../routes/__root';
import useOverpassLayer from '../../data/shared/useOverpassLayer';

import LegendLayout from './LegendLayout';
import AtlasOSMSettings from './OSMSettings';
import AtlasOSMInfoList from './OSMInfoList';
import AtlasOSMInfoFilter from './OSMInfoFilter';
import AtlasOSMInfoDetail from './OSMInfoDetail';

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

  const [activeElement, setActiveElement] = useState(null);
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
        setActiveElement,
      );
    }
    return () => {
      if (layerObjects) {
        map?.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, filteredData, isClustered]);

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <LegendLayout route={route}>
      <h1>
        <span>{name} </span>
        in {activeAdministrativeRegion['emoji']}{' '}
        {activeAdministrativeRegion['country']}
      </h1>
      <AtlasOSMSettings {...clusterSettings} />
      {isLoading && <p className="map-info__loading-emoji">🔍</p>}
      {activeElement && (
        <AtlasOSMInfoDetail
          filterKeys={filterKeys}
          iconMap={iconMap}
          activeElement={activeElement}
        />
      )}
      <AtlasOSMInfoFilter
        data={data}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        filteredData={filteredData}
        iconMap={iconMap}
        filterKeys={filterKeys}
      />
      {filteredData && (
        <AtlasOSMInfoList
          listName={name}
          map={map}
          data={filteredData}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={filterKeys}
          activeElement={activeElement}
          setActiveElement={setActiveElement}
        ></AtlasOSMInfoList>
      )}
    </LegendLayout>
  );
}

export default React.memo(MapInformationComponent);
