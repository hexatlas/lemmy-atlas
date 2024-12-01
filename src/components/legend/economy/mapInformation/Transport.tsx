import React from 'react';

import { useCallback, useEffect } from 'react';
import useEconomyTransport from '../../../../data/economy/overpass/useTransport';
import useOverpassLayer from '../../../../data/shared/useOverpassLayer';
import { iconMap } from '../../../../data/economy/overpass/emoji/Transport';
import AtlasOSMInfoList from '../../../shared/OSMInfoList';
import AtlasOSMSettings from '../../../shared/OSMSettings';

function Transport({
  // Location
  map,
  activeAdministrativeRegion,
  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useEconomyTransport(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        'railway',
        isClustered,
      );
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

  // Update Map to Selection

  // const showOnMap = useCallback(
  //   (coords) => {
  //     const mapBounds = [coords?.maxlat, coords?.minlon];
  //     map.flyTo(mapBounds, 14);
  //   },
  //   [map],
  // );

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <div id="legend-content">
      <AtlasOSMSettings {...clusterSettings} />
      {isLoading && <p className="search-loading-icon">🔍</p>}

      {data && (
        <AtlasOSMInfoList
          listName={'Railway Stations'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={['railway']}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Transport;
