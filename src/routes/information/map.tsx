import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/information/map')({
  component: MapRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/information/map',
    emoji: '📰',
    isDisabled: true,
  },
  {
    link: '/information/map',
    emoji: '🎓',
    isDisabled: true,
  },
  {
    link: '/information/map',
    emoji: '📻',
    isDisabled: true,
  },
  {
    link: '/information/map',
    emoji: '📡',
    isDisabled: true,
  },
  {
    link: '/information/map',
    emoji: '🎭',
    isDisabled: true,
  },
];

function MapRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
