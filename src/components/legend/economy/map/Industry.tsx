import { useEffect } from 'react';
import useOverpassLayer from '../../../../emoji/useOverpassLayer';
import useEconomyIndustry from '../../../../data/overpass/economy/useEconomyIndustry';

import { iconMap } from '../../../../emoji/economy/Industry';
import AtlasOSMInfoList from '../../../shared/AtlasOSMInfoList';
import AtlasOSMSettings from '../../../shared/AtlasOSMSettings';

export function Industry({
  // Location
  map,
  setMap,

  isOpenAtlasMapInterface,
  setIsOpenAtlasMapInterface,

  isLocationSelectMode,
  setIsLocationSelectMode,

  activeLocationSelection,
  setActiveLocationSelection,

  nominatim,
  setNominatim,

  regionTypes,
  activeLocationType,
  setActiveLocationType,

  activeAdministrativeRegion,
  setActiveAdministrativeRegion,

  administrativeRegionClickHistoryArray,
  setAdministrativeRegionClickHistoryArray,

  locationQuery,
  setLocationQuery,

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
