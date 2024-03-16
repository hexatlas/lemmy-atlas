// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import AtlasNexusClassStructure from "./AtlasNexusClassStructure";
import AtlasNexusIMFData from "./AtlasNexusIMFData";
import AtlasNexusBulletins from "./AtlasNexusBulletins";
import AtlasWiki from "./AtlasWiki";

function AtlasNexusCard({ interfaceProps }) {
  return (
    <>
      <Tabs.Root id="atlas-tabs" className="nexus-card" defaultValue="Bulletins">
        <Tabs.List className="tabs-list" aria-label="Manage your account">
          <Tabs.Trigger className="tabs-trigger" value="ClassStructureTab">
            Class Structure
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="IMFDataTab">
            IMF Data
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Bulletins">
            72T's Bulletins
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="ProleWiki">
            ProleWiki
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="NatoPedia">
            NATOpedia
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="ClassStructureTab">
          <AtlasNexusClassStructure />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="IMFDataTab">
          <AtlasNexusIMFData {...interfaceProps} />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="Bulletins">
          <AtlasNexusBulletins {...interfaceProps} />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="ProleWiki">
          <AtlasWiki
            wikiURL={"https://en.prolewiki.org/"}
            {...interfaceProps}
            isProleWiki={true}
          />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="NatoPedia">
          <AtlasWiki wikiURL={"https://en.wikipedia.org/w/"} {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasNexusCard;
