// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import { useStateStorage } from '../../../hooks/useAtlasUtils';

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeMilitaryMapInformationTab',
    'Barracks',
  );
  return (
    <>
      <Tabs.Root
        className="nexus-card"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="Barracks">
            ⚔️
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Barracks" className="tabs-content"></Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
