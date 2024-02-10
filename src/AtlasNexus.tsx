// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import AtlasNexusClassStructure from "./AtlasNexusClassStructure";
import AtlasNexusIMFData from "./AtlasNexusIMFData";

function AtlasNexusCard({ interfaceProps }) {
  return (
    <>
      <Tabs.Root
        id="atlas-tabs"
        className="nexus-card"
        defaultValue="ClassStructureTab"
      >
        <Tabs.List className="tabs-list" aria-label="Manage your account">
          <Tabs.Trigger className="tabs-trigger" value="ClassStructureTab">
            Class Structure
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="IMFDataTab">
            IMF Data
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="ClassStructureTab">
          <AtlasNexusClassStructure />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="IMFDataTab">
          <AtlasNexusIMFData {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasNexusCard;
