// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { useStateStorage } from "./hooks/useAtlasUtils";

import AtlasNexusCard from "./components/information/AtlasNexus";
import AtlasFediverse from "./components/information/AtlasFediverse";
import AtlasMisc from "./components/information/nexus/AtlasMisc";
import AtlasMapInformation from "./components/information/AtlasMapInformation";

import { lemmyInstances, listingTypes, searchTypes, sortTypes } from "./Atlas_Config";

function AtlasInformation({ interfaceProps }) {
  const [activeTab, setActiveTab] = useStateStorage("activeInformationTab", "NexusTab");

  // LEMMY
  const [activeLemmyInstance, setActiveLemmyInstance] = useStateStorage(
    "activeLemmyInstance",
    lemmyInstances[0] // Default: hexbear.net
  );
  const [activeCommunity, setActiveCommunity] = useStateStorage("activeCommunity", null); // c/News
  const [activeSearchType, setActiveSearchType] = useStateStorage(
    "activeSearchType",
    searchTypes[0]
  ); // Default: Comments
  const [activeListingType, setActiveListingType] = useStateStorage(
    "activeListingType",
    listingTypes[1]
  ); // Default: Local
  const [activeSortType, setActiveSortType] = useStateStorage(
    "activeSortType",
    sortTypes[1]
  ); // Default: New Sort

  const interfacePropsWithLemmy = {
    ...interfaceProps,

    // Community
    lemmyInstances,
    activeLemmyInstance,
    setActiveLemmyInstance,

    activeCommunity,
    setActiveCommunity,

    activeSearchType,
    setActiveSearchType,

    listingTypes,
    activeListingType,
    setActiveListingType,

    sortTypes,
    activeSortType,
    setActiveSortType,
  };

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
        <Tabs.Trigger className="tabs-trigger emoji-label" value="NexusTab">
          📚
        </Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger emoji-label" value="Fediverse">
          👥
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content dark" value="Misc">
        <AtlasMisc {...interfacePropsWithLemmy} />
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="MapInformation">
        <AtlasMapInformation
          interfaceProps={interfacePropsWithLemmy}
        ></AtlasMapInformation>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="NexusTab">
        <AtlasNexusCard interfaceProps={interfacePropsWithLemmy} />
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="Fediverse">
        <AtlasFediverse interfaceProps={interfacePropsWithLemmy} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default AtlasInformation;
