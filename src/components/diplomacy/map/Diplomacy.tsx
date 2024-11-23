// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useDiplomacyEmbassies from "../../../hooks/overpass/useDiplomacyEmbassies"; // Import the new hook
import useOverpassLayer from "../../map/useOverpassLayer";

import { iconMap } from "../../map/diplomacy/Diplomacy"; // Assuming you will create an iconMap for embassies

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
    let diplomaticLayerObjects;
    if (map && data) {
      diplomaticLayerObjects = useOverpassLayer(
        map,
        data,
        iconMap,
        "diplomatic",
        isClustered
      ); // Adjust the Overpass function accordingly
    }
    return () => {
      if (diplomaticLayerObjects) {
        map.removeLayer(diplomaticLayerObjects.overpassLayer);
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
        <small>
          {data?.elements.length} Diplomatic Locations found in{" "}
          {activeAdministrativeRegion["country"]}
        </small>
      )}
      {data &&
        data?.elements.map((element, index) => (
          <div key={index}>
            <AtlasOSMInfoCard
              key={index}
              element={element}
              map={map}
              iconMap={iconMap}
              filterKeys={["diplomatic"]}
            ></AtlasOSMInfoCard>
            {element?.bounds && (
              <button type="button" onClick={() => showOnMap(element?.bounds)}>
                📍
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Diplomacy;
