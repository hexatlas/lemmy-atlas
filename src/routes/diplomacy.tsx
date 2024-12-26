import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../types/atlas.types';
import LegendNavigation from '../components/shared/AtlasNavigation';

export const Route = createFileRoute('/diplomacy')({
  component: DiplomacyRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/diplomacy/links',
    emoji: '🔗',
    isDisabled: true,
  },
  {
    link: '/diplomacy/map',
    emoji: '🌐',
    isDisabled: false,
  },
];

function DiplomacyRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
