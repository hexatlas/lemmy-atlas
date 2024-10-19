// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import { useStateStorage } from "../../hooks/useAtlasUtils";
import AtlasClassStructure from "./AtlasClassStructure";

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    "activeGovernmentMapInformationTab",
    "MapInformation"
  );
  return (
    <>
      <Tabs.Root className="nexus-card" value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="MapInformation">
            🎩
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="MapInformation" className="tabs-content">
          <AtlasClassStructure interfaceProps={interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
