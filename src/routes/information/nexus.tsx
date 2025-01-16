import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LegendNavigation from '../../components/shared/AtlasNavigation';
import { AtlasNavigation } from '../../types/atlas.types';

import prolewiki from '../../assets/icons/prolewiki.png';
import natopedia from '../../assets/icons/natopedia.svg';
import anarchistlibrary from '../../assets/icons/anarchistlibrary.png';

export const Route = createFileRoute('/information/nexus')({
  component: NexusRouteComponent,
});

const navigationLinks: AtlasNavigation[] = [
  {
    link: '/information/nexus/prolewiki',
    emoji: <img src={prolewiki} alt="ProleWiki" className="custom-icon" />,
    isDisabled: false,
  },
  {
    link: '/information/nexus/natopedia',
    emoji: <img src={natopedia} alt="NatoWiki" className="custom-icon" />,
    isDisabled: false,
  },
  {
    link: '/information/nexus/72Tbulletins',
    emoji: '7️⃣2️⃣🇹',
    isDisabled: false,
  },
  {
    link: '/information/nexus/anarchistlibrary',
    emoji: (
      <img
        src={anarchistlibrary}
        alt="Anarchist Libaray"
        className="custom-icon"
      />
    ),
    isDisabled: false,
  },
];

function NexusRouteComponent() {
  return <LegendNavigation links={navigationLinks} route={Route} />;
}
