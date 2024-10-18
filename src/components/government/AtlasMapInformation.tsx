// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import { useStateStorage } from "../../hooks/useAtlasUtils";

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    "activeFediverseTab",
    "MapInformation"
  );
  return (
    <>
      <Tabs.Root className="nexus-card" value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="MapInformation">
            MapInformation
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Mastodon">
            Mastodon
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="MapInformation" className="tabs-content"></Tabs.Content>
        <Tabs.Content value="Mastodon" className="tabs-content"></Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
