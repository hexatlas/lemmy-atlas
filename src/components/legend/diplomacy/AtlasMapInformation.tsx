// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from '@radix-ui/react-tabs';

import { useStateStorage } from '../../../hooks/useAtlasUtils';
import Diplomacy from './map/Diplomacy';

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    'activeDiplomacyMapInformationTab',
    'Embassies',
  );
  return (
    <>
      <Tabs.Root
        className="nexus-card"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="Embassies">
            🏛️
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Embassies" className="tabs-content">
          <Diplomacy {...interfaceProps}></Diplomacy>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
