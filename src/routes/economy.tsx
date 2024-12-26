import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../types/atlas.types';
import LegendNavigation from '../components/shared/AtlasNavigation';

export const Route = createFileRoute('/economy')({
  component: EconomyRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/economy/links',
    emoji: '🔗',
    isDisabled: false,
  },
  {
    link: '/economy/map',
    emoji: '🌐',
    isDisabled: false,
  },
  {
    link: '/economy/charts',
    emoji: '📈',
    isDisabled: false,
  },
];

function EconomyRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
