import { useCallback, useEffect } from "react";
import useDiplomacyEmbassies from "../../../hooks/overpass/useDiplomacyEmbassies"; // Import the new hook
import useOverpassLayer from "../../map/useOverpassLayer";
import { iconMap } from "../../map/diplomacy/Diplomacy"; // Assuming you will create an iconMap for embassies
import AtlasOSMInfoList from "../../shared/AtlasOSMInfoList";

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

  return (
    <div id="legend-content">
      <button type="button" onClick={() => setIsClustered(!isClustered)}>
        {isClustered ? "🚀" : "🐢"}
      </button>
      {isLoading && <p className="search-loading-icon">🔍</p>}
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
