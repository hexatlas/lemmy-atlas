import React from 'react';
import LegendNavigation from './AtlasNavigation';
import { AtlasContext } from '../../routes/__root';
import { TileLayer, tileLayer } from 'leaflet';
import { AtlasNavigation } from '../../types/atlas.types';

const sataliteLayer = tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
);

function MapRouteComponent({
  navigationLinks,
  route,
}: {
  navigationLinks: AtlasNavigation[];
  route: unknown;
}) {
  const { map } = React.useContext(AtlasContext)!;

  function updateMapLayer() {
    map?.eachLayer((layer) => {
      if (layer instanceof TileLayer) {
        map.removeLayer(layer);
      }
    });
    map?.addLayer(sataliteLayer);
  }

  updateMapLayer();

  return <LegendNavigation links={navigationLinks} route={route} />;
}

export default React.memo(MapRouteComponent);
