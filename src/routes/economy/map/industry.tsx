import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import MapInformationComponent from '../../../components/shared/MapInformationComponent';
import useEconomyIndustry from '../../../data/economy/overpass/useIndustry';
import { iconMap } from '../../../data/economy/overpass/emoji/industry';

export const Route = createFileRoute('/economy/map/industry')({
  component: () => (
    <MapInformationComponent
      name={'Industrial Features'}
      useMapInformation={useEconomyIndustry}
      filterKeys={['industrial']}
      iconMap={iconMap}
      route={Route}
    />
  ),
});
