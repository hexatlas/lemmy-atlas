import React from 'react';

import { useEffect } from 'react';
import useOverpassLayer from '../../../../data/shared/useOverpassLayer';
import useInformationMedia from '../../../../data/information/overpass/useMedia';

import { iconMap } from '../../../../data/information/overpass/emoji/Media';
import AtlasOSMInfoList from '../../../shared/OSMInfoList';
import AtlasOSMSettings from '../../../shared/OSMSettings';

export function Media({
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
  const { data, isLoading } = useInformationMedia(activeAdministrativeRegion); // Updated hook

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        'communication',
        isClustered,
      ); // Updated to "media"
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
          listName={'Media Features'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={['communication']}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Media;
