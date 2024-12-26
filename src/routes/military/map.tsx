import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/military/map')({
  component: MapRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/military/map',
    emoji: '🏰',
    isDisabled: true,
  },
  {
    link: '/military/map',
    emoji: '👽',
    isDisabled: true,
  },
  {
    link: '/military/map',
    emoji: '🔫',
    isDisabled: true,
  },
  {
    link: '/military/map',
    emoji: '🚁',
    isDisabled: true,
  },
];

function MapRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
