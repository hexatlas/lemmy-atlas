import React from 'react';

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import { useStateStorage } from '../../../hooks/useAtlasUtils';
import Media from './mapInformation/Media';

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeInformationMapInformationTab',
    'Media',
  );
  return (
    <>
      <Tabs.Root
        className="nexus-card"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="Media">
            📰
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Media" className="tabs-content">
          <Media {...interfaceProps}></Media>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
