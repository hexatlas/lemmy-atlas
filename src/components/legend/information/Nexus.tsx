import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import AtlasNexusBulletins from './nexus/NewsBulletins';
import AtlasWiki from './nexus/Wiki';
import AtlasNexusAnarchistLibrary from './nexus/AnarchistLibrary';
import { useStateStorage } from '../../../hooks/useAtlasUtils';

function AtlasNexusCard({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeNexusTab',
    'ProleWiki',
  );

  return (
    <>
      <Tabs.Root
        className="nexus-card"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List
          className="tabs-list tabs-nexus"
          aria-label="Pick Nexus Item"
        >
          <Tabs.Trigger className="tabs-trigger" value="ProleWiki">
            ProleWiki
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="NatoPedia">
            NATOpedia
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Bulletins">
            72T&#39;s Bulletins
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="AnarchistLibrary">
            Anarchist Library
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content dark" value="Bulletins">
          <AtlasNexusBulletins {...interfaceProps} />
        </Tabs.Content>
        <Tabs.Content className="tabs-content dark" value="ProleWiki">
          <AtlasWiki
            wikiURL={'https://en.prolewiki.org'}
            {...interfaceProps}
            isProleWiki={true}
          />
        </Tabs.Content>
        <Tabs.Content className="tabs-content dark" value="NatoPedia">
          <AtlasWiki
            wikiURL={'https://en.wikipedia.org/w'}
            {...interfaceProps}
          />
        </Tabs.Content>
        <Tabs.Content className="tabs-content dark" value="AnarchistLibrary">
          <AtlasNexusAnarchistLibrary {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasNexusCard;
