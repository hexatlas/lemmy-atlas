import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import MapInformationComponent from '../../../components/shared/AtlasMapInformationComponent';
import useDiplomacyEmbassies from '../../../data/diplomacy/overpass/useDiplomatic';
import { iconMap } from '../../../data/diplomacy/overpass/emoji/diplomatic';

export const Route = createFileRoute('/diplomacy/map/embassy')({
  component: () => (
    <MapInformationComponent
      name={'Diplomatic Locations'}
      useMapInformation={useDiplomacyEmbassies}
      filterKeys={['diplomatic', 'target']}
      iconMap={iconMap}
      route={Route}
    />
  ),
});
