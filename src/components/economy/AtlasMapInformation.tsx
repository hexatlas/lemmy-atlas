// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import { useStateStorage } from "../../hooks/useAtlasUtils";
import Energy from "./map/Energy";
import Transport from "./map/Transport";
import Industry from "./map/Industry";

function AtlasMapInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage(
    "activeEconomyMapInformationTab",
    "Energy"
  );

  return (
    <>
      <Tabs.Root className="nexus-card" value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Economy Type">
          <Tabs.Trigger className="tabs-trigger" value="Industry">
            🏭
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Energy">
            ⚡
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Transport">
            🚈
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Industry" className="tabs-content">
          <Industry {...interfaceProps}></Industry>
        </Tabs.Content>
        <Tabs.Content value="Energy" className="tabs-content">
          <Energy {...interfaceProps}></Energy>
        </Tabs.Content>
        <Tabs.Content value="Transport" className="tabs-content">
          <Transport {...interfaceProps}></Transport>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasMapInformation;
