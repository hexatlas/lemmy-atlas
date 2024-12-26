import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

export const Route = createFileRoute('/information/fediverse')({
  component: FediverseRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/information/fediverse/lemmy',
    emoji: 'Lemmy',
    isDisabled: false,
  },
  {
    link: '/information/fediverse/mastodon',
    emoji: 'Mastodon',
    isDisabled: false,
  },
];

function FediverseRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
