// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";
import AtlasIMFData from "./components/economy/AtlasIMFData";
import AtlasMisc from "./components/economy/AtlasMisc";

function AtlasEconomy({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeInformationTab", "IMFData");

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger" value="IMFData">
          IMF
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger" value="Misc">
          Misc
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="IMFData">
        <AtlasIMFData {...interfaceProps}></AtlasIMFData>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Misc">
        <AtlasMisc {...interfaceProps}></AtlasMisc>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasEconomy;
