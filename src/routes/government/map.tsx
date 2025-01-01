import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AtlasNavigation } from '../../types/atlas.types';
import MapRouteComponent from '../../components/shared/AtlasMapRouteComponent';

export const Route = createFileRoute('/government/map')({
  component: () => (
    <MapRouteComponent navigationLinks={navigationLinks} route={Route} />
  ),
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/government/map',
    emoji: '🏥',
    isDisabled: true,
  },
  {
    link: '/government/map',
    emoji: '🚒',
    isDisabled: true,
  },
  {
    link: '/government/map',
    emoji: '🚓',
    isDisabled: true,
  },
  {
    link: '/government/map',
    emoji: '🏞️',
    isDisabled: true,
  },
  {
    link: '/government/map',
    emoji: '🪹',
    isDisabled: true,
  },
];
