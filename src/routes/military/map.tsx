import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../../types/atlas.types';
import MapRouteComponent from '../../components/shared/AtlasMapRouteComponent';

export const Route = createFileRoute('/military/map')({
  component: () => (
    <MapRouteComponent navigationLinks={navigationLinks} route={Route} />
  ),
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
