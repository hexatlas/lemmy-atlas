import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import AtlasLemmy from './fediverse/lemmy/Index';
import AtlasMastodon from './fediverse/mastodon/Index';
import { useStateStorage } from '../../../hooks/useAtlasUtils';

function AtlasFediverse({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeFediverseTab',
    'Lemmy',
  );
  return (
    <>
      <Tabs.Root
        className="nexus-card"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="Lemmy">
            Lemmy
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Mastodon">
            Mastodon
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Lemmy" className="tabs-content dark">
          <AtlasLemmy {...interfaceProps} />
        </Tabs.Content>
        <Tabs.Content value="Mastodon" className="tabs-content dark">
          <AtlasMastodon {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasFediverse;
