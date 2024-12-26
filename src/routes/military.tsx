import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { AtlasNavigation } from '../types/atlas.types';
import LegendNavigation from '../components/shared/AtlasNavigation';

export const Route = createFileRoute('/military')({
  component: MilitaryRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/military/links',
    emoji: '🔗',
    isDisabled: true,
  },
  {
    link: '/military/map',
    emoji: '🌐',
    isDisabled: false,
  },
];

function MilitaryRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
