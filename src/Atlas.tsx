import { useEffect, useMemo, useState, useRef } from "react";

// https://www.radix-ui.com/primitives/docs/components/tabs
import * as Tabs from "@radix-ui/react-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Imoport SCSS

// Import Components
import AtlasMap from "./AtlasMap";
import AtlasInterface from "./AtlasMapInterface";
import AtlasEconomy from "./AtlasEconomy";
import AtlasInformation from "./AtlasInformation";
import AtlasDiplomacy from "./AtlasDiplomacy";
import AtlasMilitary from "./AtlasMilitary";
import AtlasGovernment from "./AtlasGovernment";

// Import customHook
import { regionTypes } from "./Atlas_Config";
import { useStateStorage } from "./hooks/useAtlasUtils";

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
  const [legendSize, setLegendSize] = useState(1.6180339887498948482 ^ 512);

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

  const [isClustered, setIsClustered] = useStateStorage("isClustered", true);

  /*
      useStates
  */

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

  const [activeMainTab, setActiveMainTab] = useStateStorage("activeMainTab", undefined);

  /*
      useEffects
  */
  useEffect(() => {
    if (isMobile && activeAdministrativeRegion.country === "country") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    if (isMobile && activeAdministrativeRegion.country !== "country") {
      window.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop * 1.312,
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
    }
  }, [activeAdministrativeRegion, activeLocationType, nominatim]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  /*
      FUNCTIONS
  */

  // Handle Resize Legend
  const handleResize = () => {
    setTimeout(() => map.invalidateSize(), 300);
    setIsMobile(window.innerWidth < 768);
  };

  // Reset Atlas
  function resetAtlas() {
    setActiveLocationSelection([]);
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

    if (sideBarRef.current)
      sideBarRef.current.scrollTo({
        top: document.getElementById("atlas-tabs").offsetTop,
        behavior: "smooth",
      });
  }

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

    legendSize,
    setLegendSize,

    isClustered,
    setIsClustered,

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
  };

  const queryClient = new QueryClient({});

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
          gridTemplateColumns: `1.6180339887498948482fr ${legendSize}px`,
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
          value={activeMainTab}
          onValueChange={setActiveMainTab}
          defaultValue={"Introduction"}
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
          <Tabs.Content className="tabs-content" value="Introduction">
            <div className="atlas-legend container light">
              <h1>Atlas</h1>
              <p>
                This Atlas uses OpenStreetMaps, Overpass, Nominatim, ProleWiki, Wikipedia,
                Lemmy, Mastodon, and aims to provide a comprehensive view of various
                instruments of state power across different countries.
              </p>
              <h2>Instructions</h2>
              <blockquote>
                <i className="secondary">Attention:</i> Select an{" "}
                <span className="primary">
                  <i>option</i>
                </span>{" "}
                to reveal{" "}
                <span className="tertiary">
                  <i>selected information</i>
                </span>
                .
              </blockquote>
              <ul className="container dark">
                <li>
                  <b>Select Country:</b> Use the search or click on the map, or 🎲 for a
                  random pick.
                </li>
                <li>
                  <b>State Power Options:</b>
                  <ul className="container">
                    <li>
                      🪙 <b>Economy</b>
                    </li>
                    <li>
                      ℹ️ <b>Information</b>
                    </li>
                    <li>
                      🕊️ <b>Diplomacy</b>
                    </li>
                    <li>
                      🛡️ <b>Security</b>
                    </li>
                    <li>
                      🏛️ <b>Institutions</b>
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Map Layers:</b> Switch between satellite, terrain, or boundaries. 🗺️
                </li>
                <li>
                  <b>Show on Map:</b> Look for 📍 to pinpoint locations. 🌐
                </li>
                <li>
                  <b>Extra Resources:</b> Click 🔗 for further reading.
                </li>
              </ul>

              <blockquote>
                <b>Note:</b> Data availability differs by country and topic.
              </blockquote>
            </div>
          </Tabs.Content>
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
