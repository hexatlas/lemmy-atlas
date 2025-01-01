import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../../types/atlas.types';
import MapRouteComponent from '../../components/shared/AtlasMapRouteComponent';

export const Route = createFileRoute('/information/map')({
  component: () => (
    <MapRouteComponent navigationLinks={navigationLinks} route={Route} />
  ),
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
