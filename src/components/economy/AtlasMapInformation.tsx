// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import { useStateStorage } from "../../hooks/useAtlasUtils";
import EnergyInfrastructure from "./map/EnergyInfrastructure";

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    "activeFediverseTab",
    "EnergyInfrastructure"
  );
  return (
    <>
      <Tabs.Root className="nexus-card" value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="EnergyInfrastructure">
            ⚡
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Transport" disabled>
            🚈
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="EnergyInfrastructure" className="tabs-content">
          <EnergyInfrastructure {...interfaceProps}></EnergyInfrastructure>
        </Tabs.Content>
        <Tabs.Content value="Transport" className="tabs-content"></Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
