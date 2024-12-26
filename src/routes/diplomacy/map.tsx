import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/diplomacy/map')({
  component: MapRouteComponent,
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

function MapRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
