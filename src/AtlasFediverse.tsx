// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

import AtlasLemmy from "./components/fediverse/lemmy/AtlasLemmy";
import AtlasMastodon from "./components/fediverse/AtlasMastodon";

function AtlasFediverse({ interfaceProps }) {
  return (
    <>
      <Tabs.Root id="atlas-tabs" className="nexus-card" defaultValue="Lemmy">
        <Tabs.List className="tabs-list tabs-nexus" aria-label="Pick Fediverse">
          <Tabs.Trigger className="tabs-trigger" value="Lemmy">
            Lemmy
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="Mastodon">
            Mastodon
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="Lemmy">
          <AtlasLemmy {...interfaceProps} />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="Mastodon">
          <AtlasMastodon {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

export default AtlasFediverse;
