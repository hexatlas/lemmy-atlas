// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";
import AtlasIMFData from "./components/economy/AtlasIMFData";
import AtlasMisc from "./components/economy/AtlasMisc";
import AtlasMapInformation from "./components/economy/AtlasMapInformation";

function AtlasEconomy({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeEconomyTab", "MapInformation");

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
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Charts">
          📈
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content dark" value="Misc">
        <AtlasMisc {...interfaceProps}></AtlasMisc>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="MapInformation">
        <AtlasMapInformation interfaceProps={interfaceProps}></AtlasMapInformation>
      </Tabs.Content>
      <Tabs.Content className="tabs-content dark" value="Charts">
        <AtlasIMFData {...interfaceProps}></AtlasIMFData>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasEconomy;
