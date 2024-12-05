import React, { useCallback, useEffect } from 'react';
import useDiplomacyEmbassies from '../../../../data/diplomacy/overpass/useDiplomatic';
import useOverpassLayer from '../../../../data/shared/useOverpassLayer';
import { iconMap } from '../../../../data/diplomacy/overpass/emoji/Diplomatic';
import AtlasOSMInfoList from '../../../shared/OSMInfoList';
import AtlasOSMSettings from '../../../shared/OSMSettings';

export function Diplomacy({
  // Location
  map,
  activeAdministrativeRegion,
  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useDiplomacyEmbassies(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        'diplomatic',
        isClustered,
      ); // Adjust the Overpass function accordingly
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
      {isLoading && <p className="search-loading-emoji">🔍</p>}
      <AtlasOSMSettings {...clusterSettings} />
      {data && (
        <AtlasOSMInfoList
          listName={'Diplomatic Locations'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={['diplomatic']}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Diplomacy;
