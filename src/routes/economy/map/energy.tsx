import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import MapInformationComponent from '../../../components/shared/AtlasMapInformationComponent';
import useEconomyEnergy from '../../../data/economy/overpass/useEnergy';
import { iconMap } from '../../../data/economy/overpass/emoji/energy';

export const Route = createFileRoute('/economy/map/energy')({
  component: () => (
    <MapInformationComponent
      name={'Power Plants'}
      useMapInformation={useEconomyEnergy}
      filterKeys={[
        'plant:source',
        'plant:output:electricity',
        'power',
        'plant:method',
        'plant:type',
        'start_date',
        'operator',
      ]}
      iconMap={iconMap}
      route={Route}
    />
  ),
});
