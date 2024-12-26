import React, { useEffect, useContext } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../../__root';
import useEconomyEnergy from '../../../data/economy/overpass/useEnergy';
import { iconMap } from '../../../data/economy/overpass/emoji/energy';
import AtlasOSMSettings from '../../../components/shared/OSMSettings';
import AtlasOSMInfoList from '../../../components/shared/OSMInfoList';
import useOverpassLayer from '../../../data/shared/useOverpassLayer';
import LegendLayout from '../../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/economy/map/energy')({
  component: EnergyRouteComponent,
});

function EnergyRouteComponent() {
  const {
    // Location
    map,
    activeAdministrativeRegion,
    isClustered,
    setIsClustered,
  } = useContext(AtlasContext)!;
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
        map?.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <LegendLayout route={Route}>
      <AtlasOSMSettings {...clusterSettings} />
      {isLoading && <p className="search-loading-emoji">🔍</p>}
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
    </LegendLayout>
  );
}
