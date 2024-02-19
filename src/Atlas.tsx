import { useEffect, useMemo, useState } from "react";

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

// Import Components

import AtlasMap from "./AtlasMap";
import AtlasCommunity from "./AtlasCommunity";
import AtlasInterface from "./AtlasMapInterface";
import AtlasNexusCard from "./AtlasNexus";

import {
  lemmyInstances,
  listingTypes,
  regionTypes,
  searchTypes,
  sortTypes,
} from "./Atlas_Config";

export default function Atlas() {
  /* Interfaces*/

  interface AdministrativeRegionObject {
    country: string;
    name: string;
  }

  /*
    useStates
  */
  // DEVICE
  const [isMobile, setIsMobile] = useState(null);
  const [nexusSize, setNexusSize] = useState(1.6180339887498948482 ^ 512);

  // LOCATION
  const [map, setMap] = useState(null);
  const [
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,
  ] = useState<AdministrativeRegionObject[]>([]);
  const [activeAdministrativeRegion, setActiveAdministrativeRegion] =
    useState<AdministrativeRegionObject>({
      country: "Country",
      name: "Administrative Region",
    });
  const [activeRegionType, setActiveRegionType] = useState(regionTypes[0]); // Default: Country Sort
  const [locationQuery, setLocationQuery] = useState("");

  // DATA
  const [activeIndicator, setActiveIndicator] = useState({
    name: "PPPGDP",
    label: "GDP, current prices",
    description:
      'Gross domestic product is the most commonly used single measure of a country\'s overall economic activity. It represents the total value in PPP terms of final goods and services produced within a country during a specified time period.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
    source: "World Economic Outlook (October 2023)",
    unit: "Purchasing power parity; billions of international dollars",
    dataset: "WEO",
  });

  // COMMUNITY
  const [activeLemmyInstance, setActiveLemmyInstance] = useState(
    lemmyInstances[0] // Default: hexbear.net
  );
  const [activeCommunity, setActiveCommunity] = useState(
    activeLemmyInstance.community_id
  ); // c/News
  const [activeSearchType, setActiveSearchType] = useState(searchTypes[2]); // Default: Comments
  const [activeListingType, setActiveListingType] = useState(listingTypes[1]); // Default: Local
  const [activeSortType, setActiveSortType] = useState(sortTypes[1]); // Default: New Sort

  /*
      RESET ATLAS
  */
  function resetAtlas() {
    // LOCATION
    setAdministrativeRegionClickHistoryArray([]);
    setActiveAdministrativeRegion({
      country: "Country",
      name: "Administrative Region",
    });
    setActiveRegionType(regionTypes[0]); // Default: Country Sort
    setLocationQuery("");

    // DATA
    setActiveIndicator({
      name: "PPPGDP",
      label: "GDP, current prices",
      description:
        'Gross domestic product is the most commonly used single measure of a country\'s overall economic activity. It represents the total value in PPP terms of final goods and services produced within a country during a specified time period.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
      source: "World Economic Outlook (October 2023)",
      unit: "Purchasing power parity; billions of international dollars",
      dataset: "WEO",
    });

    // COMMUNITY
    setActiveLemmyInstance(
      lemmyInstances[0] // Default: hexbear.net
    );
    setActiveCommunity(null);
    setActiveSearchType(searchTypes[1]); // Default: Comments
    setActiveListingType(listingTypes[1]); // Default: Local
    setActiveSortType(sortTypes[1]); // Default: New Sort
  }

  /*
      useEffects
  */

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust the threshold as needed
    };

    // Initial check
    handleResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop,
        behavior: "smooth",
      });
    }
    setAdministrativeRegionClickHistoryArray([
      activeAdministrativeRegion,
      ...administrativeRegionClickHistoryArray,
    ]);
    // console.log(administrativeRegionClickHistoryArray);
  }, [activeAdministrativeRegion]);

  // Handle Browser Back Button
  //  Start
  // const handleBackButton = () => {
  //   const administrativeRegionWindow = JSON.parse(
  //     decodeURI(window.location.pathname.replace("/", ""))
  //   );

  //   const selectedAdministrativeRegion = administrativeRegionsData?.features.find(
  //     (administrativeRegion) => administrativeRegion.properties.id === administrativeRegionWindow.id
  //   );
  //   if (selectedAdministrativeRegion) setActiveAdministrativeRegion(selectedAdministrativeRegion.properties);
  // };

  // useEffect(() => {
  //   if (window.location.pathname.length > 1) handleBackButton();

  //   window.addEventListener("popstate", handleBackButton);

  //   return () => {
  //     window.removeEventListener("popstate", handleBackButton);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (window && activeAdministrativeRegion)
  //     window.history.pushState(
  //       null,
  //       "",
  //       `/${encodeURI(JSON.stringify(activeAdministrativeRegion))}`
  //     );
  // }, [activeAdministrativeRegion]);
  // End

  /*
      Styles
  */
  const administrativeRegionStyle = {
    color: "hsl(var(--atlas-color-dark) / var(--atlas-opacity-3))",
    fillOpacity: 0,
    weight: 0.161,
  };

  const administrativeRegionStyleHovered = {
    color: "hsl(var(--atlas-color-primary))",
    fillOpacity: 0.161,
    weight: 0.161,
  };

  const interfaceProps = {
    // Util
    isMobile,
    resetAtlas,

    nexusSize,
    setNexusSize,

    // Location
    map,
    setMap,

    regionTypes,
    activeRegionType,
    setActiveRegionType,

    activeAdministrativeRegion,
    setActiveAdministrativeRegion,

    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,

    locationQuery,
    setLocationQuery,

    // Data
    activeIndicator,
    setActiveIndicator,

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

    // Styles
    administrativeRegionStyle,
    administrativeRegionStyleHovered,
  };

  const DisplayAtlasMap = useMemo(
    () => <AtlasMap {...interfaceProps} />,
    [activeAdministrativeRegion, activeRegionType]
  );

  return (
    <div
      className={`atlas ${
        activeAdministrativeRegion.country !== "Country" && "atlas--active"
      }`}
      style={{
        gridTemplateColumns: `1.6180339887498948482fr ${nexusSize}px`,
      }}
    >
      <div
        className={`map-container ${
          activeAdministrativeRegion.country !== "Country" && "map-container--active"
        }`}
      >
        {DisplayAtlasMap}
        <AtlasInterface {...interfaceProps} />
      </div>

      <Tabs.Root
        id="atlas-tabs"
        className="atlas-tabs tabs-root"
        defaultValue="CommentsTab"
      >
        <Tabs.List className="tabs-list" aria-label="Manage your account">
          <Tabs.Trigger className="tabs-trigger" value="InfoTab">
            Nexus
          </Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="CommentsTab">
            Community
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="InfoTab">
          <AtlasNexusCard interfaceProps={interfaceProps} />
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="CommentsTab">
          <AtlasCommunity {...interfaceProps} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
