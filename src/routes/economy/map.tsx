import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/economy/map')({
  component: MapRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/economy/map/energy',
    emoji: '⚡',
    isDisabled: false,
  },
  {
    link: '/economy/map/industry',
    emoji: '🏭',
    isDisabled: false,
  },
  {
    link: '/economy/map',
    emoji: '🌾',
    isDisabled: true,
  },
  {
    link: '/economy/map',
    emoji: '📦',
    isDisabled: true,
  },
  {
    link: '/economy/map',
    emoji: '🏦',
    isDisabled: true,
  },
  {
    link: '/economy/map',
    emoji: '🚛',
    isDisabled: true,
  },
];

function MapRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
