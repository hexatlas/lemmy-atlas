import React, { useEffect } from 'react';
import useOverpassLayer from '../../../../data/shared/useOverpassLayer';
import useEconomyIndustry from '../../../../data/economy/overpass/useIndustry';

import { iconMap } from '../../../../data/economy/overpass/emoji/Industry';
import AtlasOSMInfoList from '../../../shared/OSMInfoList';
import AtlasOSMSettings from '../../../shared/OSMSettings';

export function Industry({
  // Location
  map,
  activeAdministrativeRegion,
  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useEconomyIndustry(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        'industrial',
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
          listName={'Industrial Features'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={['industrial']}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Industry;
