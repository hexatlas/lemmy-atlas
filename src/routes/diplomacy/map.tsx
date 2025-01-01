import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { AtlasNavigation } from '../../types/atlas.types';

import MapRouteComponent from '../../components/shared/AtlasMapRouteComponent';

export const Route = createFileRoute('/diplomacy/map')({
  component: () => (
    <MapRouteComponent navigationLinks={navigationLinks} route={Route} />
  ),
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/diplomacy/map/embassy',
    emoji: '🏛️',
    isDisabled: false,
  },
  {
    link: '/government/map',
    emoji: '🤝',
    isDisabled: true,
  },
  {
    link: '/government/map',
    emoji: '⚔️',
    isDisabled: true,
  },
];
