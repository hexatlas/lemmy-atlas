import { useEffect, useMemo, useState, useRef } from "react";

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

// Imoport SCSS

// Import Components
import AtlasMap from "./AtlasMap";
import AtlasInterface from "./AtlasMapInterface";
import AtlasNexusCard from "./AtlasNexus";
import AtlasFediverse from "./AtlasFediverse";

import {
  lemmyInstances,
  listingTypes,
  regionTypes,
  searchTypes,
  sortTypes,
} from "./Atlas_Config";

// Import customHook

import { useLocalStorage } from "./hooks/useAtlasUtils";

/*

 /$$   /$$                      /$$$$$$    /$$     /$$                    
| $$  | $$                     /$$__  $$  | $$    | $$                    
| $$  | $$  /$$$$$$  /$$   /$$| $$  \ $$ /$$$$$$  | $$  /$$$$$$   /$$$$$$$
| $$$$$$$$ /$$__  $$|  $$ /$$/| $$$$$$$$|_  $$_/  | $$ |____  $$ /$$_____/
| $$__  $$| $$$$$$$$ \  $$$$/ | $$__  $$  | $$    | $$  /$$$$$$$|  $$$$$$ 
| $$  | $$| $$_____/  >$$  $$ | $$  | $$  | $$ /$$| $$ /$$__  $$ \____  $$
| $$  | $$|  $$$$$$$ /$$/\  $$| $$  | $$  |  $$$$/| $$|  $$$$$$$ /$$$$$$$/
|__/  |__/ \_______/|__/  \__/|__/  |__/   \___/  |__/ \_______/|_______/                                                                           
                                                                          
                                                                                                                                                                                                                                                                            
*/

export default function Atlas() {
  /* Interfaces*/

  interface AdministrativeRegionObject {
    country: string;
    name: string;
  }

  const sideBarRef = useRef<HTMLInputElement>(null);
  /*
    useStates
  */
  // DEVICE
  const [isMobile, setIsMobile] = useState(null);
  const [nexusSize, setNexusSize] = useState(1.6180339887498948482 ^ 512);

  // LOCATION
  const [map, setMap] = useState(null);

  const [isOpenAtlasMapInterface, setIsOpenAtlasMapInterface] = useState(
    !(window.innerWidth < 768)
  );
  const [nominatim, setNominatim] = useState(null);
  const [
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,
  ] = useState<AdministrativeRegionObject[]>([]);
  const [activeAdministrativeRegion, setActiveAdministrativeRegion] = useLocalStorage(
    "activeAdministrativeRegion",
    {
      country: "country",
      name: "name",
    }
  );
  const [activeLocationType, setActiveLocationType] = useLocalStorage(
    "activeLocationType",
    regionTypes[1]
  ); // Default: Country Sort
  const [locationQuery, setLocationQuery] = useState("");

  // DATA
  const [activeIndicator, setActiveIndicator] = useLocalStorage("activeIndicator", {
    name: "PPPGDP",
    label: "GDP, current prices",
    description:
      'Gross domestic product is the most commonly used single measure of a country\'s overall economic activity. It represents the total value in PPP terms of final goods and services produced within a country during a specified time period.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
    source: "World Economic Outlook (October 2023)",
    unit: "Purchasing power parity; billions of international dollars",
    dataset: "WEO",
  });

  // COMMUNITY
  const [activeLemmyInstance, setActiveLemmyInstance] = useLocalStorage(
    "activeLemmyInstance",
    lemmyInstances[0] // Default: hexbear.net
  );
  const [activeCommunity, setActiveCommunity] = useLocalStorage(
    "activeCommunity",
    activeLemmyInstance.community_id
  ); // c/News
  const [activeSearchType, setActiveSearchType] = useLocalStorage(
    "activeSearchType",
    searchTypes[0]
  ); // Default: Comments
  const [activeListingType, setActiveListingType] = useLocalStorage(
    "activeListingType",
    listingTypes[1]
  ); // Default: Local
  const [activeSortType, setActiveSortType] = useLocalStorage(
    "activeSortType",
    sortTypes[1]
  ); // Default: New Sort

  /*
      RESET ATLAS
  */
  function resetAtlas() {
    // LOCATION
    setAdministrativeRegionClickHistoryArray([]);
    setActiveAdministrativeRegion({
      country: "country",
      name: "name",
    });
    setActiveLocationType(regionTypes[1]); // Default: Country Sort
    setLocationQuery("");
    setIsOpenAtlasMapInterface(!isMobile);

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
    setActiveSearchType(searchTypes[0]); // Default: Comments
    setActiveListingType(listingTypes[1]); // Default: Local
    setActiveSortType(sortTypes[1]); // Default: New Sort

    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop,
        behavior: "smooth",
      });
  }

  /*
      useEffects
  */

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // You can adjust the threshold as needed
  };
  useEffect(() => {
    // Initial check
    handleResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (isMobile && activeAdministrativeRegion.country === "country") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    if (isMobile && activeAdministrativeRegion.country !== "country") {
      window.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop * 0.1312,
        behavior: "smooth",
      });
    }
    setAdministrativeRegionClickHistoryArray([
      activeAdministrativeRegion,
      ...administrativeRegionClickHistoryArray,
    ]);
  }, [activeAdministrativeRegion]);

  useEffect(() => {
    if (isMobile) {
      setIsOpenAtlasMapInterface(false);
    }
    // if (sideBarRef.current) sideBarRef.current.scrollTop = 0;
    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop,
        behavior: "smooth",
      });
  }, [activeAdministrativeRegion, activeLocationType]);

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
    sideBarRef,

    nexusSize,
    setNexusSize,

    // Location
    map,
    setMap,

    isOpenAtlasMapInterface,
    setIsOpenAtlasMapInterface,

    nominatim,
    setNominatim,

    regionTypes,
    activeLocationType,
    setActiveLocationType,

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
    [activeAdministrativeRegion, activeLocationType]
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
      {isMobile && <AtlasInterface {...interfaceProps} />}
      <div className={`map-container`}>
        {DisplayAtlasMap}
        {!isMobile && <AtlasInterface {...interfaceProps} />}
      </div>

      <Tabs.Root
        id="atlas-tabs"
        className="atlas-tabs tabs-root"
        defaultValue="FediverseTab"
        ref={sideBarRef}
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
        {/* {isMobile && (
          <div
            className={`map-mobile-indicator ${
              (locationQuery ||
                activeAdministrativeRegion.country !== "Country" ||
                activeCommunity) &&
              "map-mobile-indicator-active"
            }`}
          >
            <button
              className="map-button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              🗺️
            </button>
            {locationQuery && (
              <small>
                <i>{locationQuery}</i>
                <span className="prefix"> in</span>
              </small>
            )}
            {activeAdministrativeRegion.country !== "country" && (
              <small>{activeAdministrativeRegion[activeLocationType]}</small>
            )}
            {activeCommunity && (
              <h6>
                <span className="prefix">c/</span>
                {activeCommunity && activeCommunity?.community?.name}
              </h6>
            )}
          </div>
        )} */}
      </Tabs.Root>
    </div>
  );
}
