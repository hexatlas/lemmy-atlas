import { useEffect, useMemo, useState, useRef } from "react";

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";

// Imoport SCSS

// Import Components
import AtlasMap from "./AtlasMap";
import AtlasInterface from "./AtlasMapInterface";

import {
  regionTypes,
  economicOverpassQueries,
  informationalOverpassQueries,
  diplomaticOverpassQueries,
  militaryOverpassQueries,
} from "./Atlas_Config";

// Import customHook

import { useStateStorage } from "./hooks/useAtlasUtils";
import AtlasEconomy from "./AtlasEconomy";
import AtlasInformation from "./AtlasInformation";
import AtlasClassStructure from "./components/government/AtlasClassStructure";
import AtlasDiplomacy from "./AtlasDiplomacy";
import AtlasMilitary from "./AtlasMilitary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AtlasGovernment from "./AtlasGovernment";

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

  interface LocationSelection {
    AdministrativeRegionObject: AdministrativeRegionObject;
    activeLocationType: string;
    activeLocation: string;
  }

  const sideBarRef = useRef<HTMLInputElement>(null);
  /*
    useStates
  */
  // DEVICE
  const [isMobile, setIsMobile] = useState(null);
  const [nexusSize, setNexusSize] = useState(1.6180339887498948482 ^ 512);

  // UI STATES

  const [isOpenAtlasMapInterface, setIsOpenAtlasMapInterface] = useState(
    !(window.innerWidth < 768)
  );

  const [isLocationSelectMode, setIsLocationSelectMode] = useStateStorage(
    "isLocationSelectMode",
    false
  );
  const [activeLocationSelection, setActiveLocationSelection] = useStateStorage(
    "activeLocationSelection",
    []
  );

  // LOCATION
  const [map, setMap] = useState(null);

  const [nominatim, setNominatim] = useState(null);
  const [
    administrativeRegionClickHistoryArray,
    setAdministrativeRegionClickHistoryArray,
  ] = useState([]);
  const [activeAdministrativeRegion, setActiveAdministrativeRegion] = useStateStorage(
    "activeAdministrativeRegion",
    {
      country: "country",
      name: "name",
      "intermediate-region": "intermediate-region",
      "sub-region": "sub-region",
      region: "region",
    }
  );

  const [activeLocationType, setActiveLocationType] = useStateStorage(
    "activeLocationType",
    regionTypes[1]
  ); // Default: Country Sort
  const [locationQuery, setLocationQuery] = useStateStorage("locationQuery", "");

  // DATA
  const [activeIndicator, setActiveIndicator] = useStateStorage("activeIndicator", {
    name: "PPPGDP",
    label: "GDP, current prices",
    description:
      'Gross domestic product is the most commonly used single measure of a country\'s overall economic activity. It represents the total value in PPP terms of final goods and services produced within a country during a specified time period.\n\nPurchasing Power Parity (PPP) is a theory which relates changes in the nominal exchange rate between two countries currencies to changes in the countries\' price levels. More information on PPP methodology can be found on the World Economic Outlook FAQ - <a href="http://www.imf.org/external/pubs/ft/weo/faq.htm#q4d" target="new">click here</a>',
    source: "World Economic Outlook (October 2023)",
    unit: "Purchasing power parity; billions of international dollars",
    dataset: "WEO",
  });

  const [activeTab, setActiveTab] = useStateStorage("activeMainTab", "Information");

  /*
      RESET ATLAS
  */
  function resetAtlas() {
    setActiveLocationSelection([]);

    // LOCATION
    setAdministrativeRegionClickHistoryArray([]);
    setActiveAdministrativeRegion({
      country: "country",
      name: "name",
      "intermediate-region": "intermediate-region",
      "sub-region": "sub-region",
      region: "region",
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
    // Refreshes Map after initial region selection
    setTimeout(() => map.invalidateSize(), 300);
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

    const selection = {
      activeSelection: activeAdministrativeRegion[activeLocationType],
      activeLocationType: activeLocationType,
      activeAdministrativeRegion: activeAdministrativeRegion,
    };
    setAdministrativeRegionClickHistoryArray([
      selection,
      ...administrativeRegionClickHistoryArray,
    ]);

    if (isLocationSelectMode) {
      setActiveLocationSelection([selection, ...activeLocationSelection]);
      console.log(activeLocationSelection);
    }
  }, [activeAdministrativeRegion, activeLocationType, nominatim]);

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

    isLocationSelectMode,
    setIsLocationSelectMode,

    activeLocationSelection,
    setActiveLocationSelection,

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

    // Overpass Querries
    economicOverpassQueries,
    informationalOverpassQueries,
    diplomaticOverpassQueries,
    militaryOverpassQueries,
  };

  const queryClient = new QueryClient();

  const DisplayAtlasMap = useMemo(
    () => <AtlasMap {...interfaceProps} />,
    [activeAdministrativeRegion, activeLocationType]
  );

  return (
    <QueryClientProvider client={queryClient}>
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
          ref={sideBarRef}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <Tabs.List className="tabs-list" aria-label="Manage your account">
            <Tabs.Trigger className="tabs-trigger emoji-label" value="Economy">
              🪙
            </Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger emoji-label" value="Information">
              ℹ️
            </Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger emoji-label" value="Diplomacy">
              🕊️
            </Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger emoji-label" value="Military">
              🛡️
            </Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger emoji-label" value="ClassStructure">
              🏛️
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="tabs-content" value="Economy">
            <AtlasEconomy interfaceProps={interfaceProps}></AtlasEconomy>
          </Tabs.Content>
          <Tabs.Content className="tabs-content" value="Information">
            <AtlasInformation interfaceProps={interfaceProps}></AtlasInformation>
          </Tabs.Content>
          <Tabs.Content className="tabs-content" value="Diplomacy">
            <AtlasDiplomacy interfaceProps={interfaceProps}></AtlasDiplomacy>
          </Tabs.Content>
          <Tabs.Content className="tabs-content" value="Military">
            <AtlasMilitary interfaceProps={interfaceProps}></AtlasMilitary>
          </Tabs.Content>
          <Tabs.Content className="tabs-content" value="ClassStructure">
            <AtlasGovernment interfaceProps={interfaceProps}></AtlasGovernment>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </QueryClientProvider>
  );
}
