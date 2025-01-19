import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { AtlasNavigation } from '../types/atlas.types';
import LegendNavigation from '../components/shared/Navigation';

export const Route = createFileRoute('/government')({
  component: () => <LegendNavigation links={navigationLinks} route={Route} />,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/government/links',
    emoji: '🔗',
    isDisabled: false,
  },
  {
    link: '/government/map',
    emoji: '🌐',
    isDisabled: false,
  },
  {
    link: '/government/class',
    emoji: '🎩',
    isDisabled: false,
  },
];
