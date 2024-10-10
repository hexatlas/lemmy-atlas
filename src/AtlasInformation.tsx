// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";

import AtlasNexusCard from "./components/information/AtlasNexus";
import AtlasFediverse from "./components/information/AtlasFediverse";

function AtlasInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeInformationTab", "NexusTab");

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger" value="NexusTab">
          Nexus
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger" value="FediverseTab">
          Fediverse
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="NexusTab">
        <AtlasNexusCard interfaceProps={interfaceProps} />
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="FediverseTab">
        <AtlasFediverse interfaceProps={interfaceProps} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasInformation;
