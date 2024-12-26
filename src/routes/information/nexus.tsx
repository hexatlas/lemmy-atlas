import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/information/nexus')({
  component: NexusRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/information/nexus/prolewiki',
    emoji: 'ProleWiki',
    isDisabled: false,
  },
  {
    link: '/information/nexus/natopedia',
    emoji: 'NATOPedia',
    isDisabled: false,
  },
  {
    link: '/information/nexus/72Tbulletins',
    emoji: '72Ts Bulletins',
    isDisabled: false,
  },
  {
    link: '/information/nexus/anarchistlibrary',
    emoji: 'Anarchist Library',
    isDisabled: false,
  },
];

function NexusRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
