import React, { useContext, useEffect } from 'react';
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

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
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
  }, [map, data, isClustered]);

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <LegendLayout route={route}>
      <AtlasOSMSettings {...clusterSettings} />
      {isLoading && <p className="search-loading-emoji">🔍</p>}
      {data && (
        <AtlasOSMInfoList
          listName={name}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={filterKeys}
        ></AtlasOSMInfoList>
      )}
    </LegendLayout>
  );
}

export default MapInformationComponent;
