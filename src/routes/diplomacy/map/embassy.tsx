import React, { useEffect, useContext } from 'react';
import useDiplomacyEmbassies from '../../../data/diplomacy/overpass/useDiplomatic';
import useOverpassLayer from '../../../data/shared/useOverpassLayer';
import { iconMap } from '../../../data/diplomacy/overpass/emoji/diplomatic';
import AtlasOSMInfoList from '../../../components/shared/OSMInfoList';
import AtlasOSMSettings from '../../../components/shared/OSMSettings';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasContext } from '../../__root';
import LegendLayout from '../../../components/shared/AtlasLegendLayout';

export const Route = createFileRoute('/diplomacy/map/embassy')({
  component: EmbassyRouteComponent,
});

function EmbassyRouteComponent() {
  const { map, activeAdministrativeRegion, isClustered, setIsClustered } =
    useContext(AtlasContext)!;

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
        map?.removeLayer(layerObjects.overpassLayer);
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
    <LegendLayout route={Route}>
      {isLoading && <p className="search-loading-emoji">🔍</p>}
      <AtlasOSMSettings {...clusterSettings} />
      {data && (
        <AtlasOSMInfoList
          listName={'Diplomatic Locations'}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={['diplomatic', 'target']}
        ></AtlasOSMInfoList>
      )}
    </LegendLayout>
  );
}
