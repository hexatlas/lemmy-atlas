import React, { useEffect } from 'react';
import AtlasOSMInfoList from '../../../shared/OSMInfoList';
import AtlasOSMSettings from '../../../shared/OSMSettings';
import useEconomyEnergy from '../../../../data/economy/overpass/useEnergy';
import useOverpassLayer from '../../../../data/shared/useOverpassLayer';
import { iconMap } from '../../../../data/economy/overpass/emoji/Energy';

export function Energy({
  map,
  activeAdministrativeRegion,
  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useEconomyEnergy(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        'plant:source',
        isClustered,
      );
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

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
          listName={'Power Plants'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={[
            'plant:source',
            'plant:output:electricity',
            'power',
            'plant:method',
            'plant:type',
            'start_date',
            'operator',
          ]}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Energy;
