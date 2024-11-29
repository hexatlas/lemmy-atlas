import { useCallback, useEffect } from "react";
import useDiplomacyEmbassies from "../../../data/overpass/diplomacy/useDiplomacyEmbassies"; // Import the new hook
import useOverpassLayer from "../../../emoji/useOverpassLayer";
import { iconMap } from "../../../emoji/diplomacy/Diplomacy"; // Assuming you will create an iconMap for embassies
import AtlasOSMInfoList from "../../shared/AtlasOSMInfoList";
import AtlasOSMSettings from "../../shared/AtlasOSMSettings";

export function Diplomacy({
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

  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useDiplomacyEmbassies(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(map, data, iconMap, "diplomatic", isClustered); // Adjust the Overpass function accordingly
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

  // Update Map to Selection
  const showOnMap = useCallback(
    (coords) => {
      const mapBounds = [coords?.maxlat, coords?.minlon];
      map.flyTo(mapBounds, 14);
    },
    [map]
  );

  const clusterSettings = {
    isClustered,
    setIsClustered,
  };

  return (
    <div id="legend-content">
      {isLoading && <p className="search-loading-icon">🔍</p>}
      <AtlasOSMSettings {...clusterSettings} />
      {data && (
        <AtlasOSMInfoList
          listName={"Diplomatic Locations"}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={["diplomatic"]}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Diplomacy;
