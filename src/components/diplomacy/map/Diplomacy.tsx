// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useDiplomacyEmbassies from "../../../hooks/overpass/useDiplomacyEmbassies"; // Import the new hook
import Overpass from "../../map/OverpassLayer";

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
}) {
  const { data, isLoading } = useDiplomacyEmbassies(activeAdministrativeRegion);

  useEffect(() => {
    let diplomaticLayerObjects;
    if (map && data) {
      diplomaticLayerObjects = Overpass(map, data, iconMap, "diplomatic"); // Adjust the Overpass function accordingly
    }
    return () => {
      if (diplomaticLayerObjects) {
        map.removeLayer(diplomaticLayerObjects.overpassLayer);
      }
    };
  }, [map, data]);

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
            <AtlasOSMInfoCard map={map} element={element} />
            {element?.bounds && (
              <button type="button" onClick={() => showOnMap(element?.bounds)}>
                📍
              </button>
            )}
            <br />
          </div>
        ))}
    </div>
  );
}

export default Diplomacy;
