import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../../types/atlas.types';
import MapRouteComponent from '../../components/shared/AtlasMapRouteComponent';

export const Route = createFileRoute('/economy/map')({
  component: () => (
    <MapRouteComponent navigationLinks={navigationLinks} route={Route} />
  ),
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
