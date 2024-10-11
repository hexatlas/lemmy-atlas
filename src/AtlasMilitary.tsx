// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";
import AtlasMisc from "./components/diplomacy/AtlasMisc";

function AtlasMilitary({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeMilitaryTab", "IMFData");

  return (
    <Tabs.Root
      id="atlas-tabs"
      className="atlas-tabs tabs-root"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Tabs.List className="tabs-list" aria-label="Manage your account">
        <Tabs.Trigger className="tabs-trigger" value="Barracks">
          Barracks
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger" value="Misc">
          Misc
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="Barracks"></Tabs.Content>
      <Tabs.Content className="tabs-content" value="Misc">
        <AtlasMisc {...interfaceProps}></AtlasMisc>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasMilitary;
