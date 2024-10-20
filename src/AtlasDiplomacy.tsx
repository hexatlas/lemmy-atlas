// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";
import AtlasMisc from "./components/diplomacy/AtlasMisc";
import AtlasMapInformation from "./components/diplomacy/AtlasMapInformation";

function AtlasDiplomacy({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeDiplomacyTab", "Embassies");

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Misc">
          🔗
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="MapInformation">
          🌐
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="MapInformation">
        <AtlasMapInformation interfaceProps={interfaceProps}></AtlasMapInformation>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Misc">
        <AtlasMisc {...interfaceProps}></AtlasMisc>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasDiplomacy;
