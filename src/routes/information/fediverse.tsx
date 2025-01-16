import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

import hexbear from '../../assets/icons/hexbear.svg';
import mastodon from '../../assets/icons/mastodon.svg';

export const Route = createFileRoute('/information/fediverse')({
  component: FediverseRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/information/fediverse/lemmy',
    emoji: <img src={hexbear} alt="Hexbear" className="custom-icon" />,
    isDisabled: false,
  },
  {
    link: '/information/fediverse/mastodon',
    emoji: <img src={mastodon} alt="Mastodon" className="custom-icon" />,
    isDisabled: false,
  },
];

function FediverseRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
