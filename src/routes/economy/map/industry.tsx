import React, { useEffect, useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../../__root';
import useEconomyIndustry from '../../../data/economy/overpass/useIndustry';
import useOverpassLayer from '../../../data/shared/useOverpassLayer';
import { iconMap } from '../../../data/economy/overpass/emoji/industry';
import AtlasOSMSettings from '../../../components/shared/OSMSettings';
import AtlasOSMInfoList from '../../../components/shared/OSMInfoList';

export const Route = createFileRoute('/economy/map/industry')({
  component: IndustryRouteComponent,
});

function IndustryRouteComponent() {
  const {
    // Location
    map,
    activeAdministrativeRegion,
    isClustered,
    setIsClustered,
  } = useContext(AtlasContext);
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
      {isLoading && <p className="search-loading-emoji">🔍</p>}

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
