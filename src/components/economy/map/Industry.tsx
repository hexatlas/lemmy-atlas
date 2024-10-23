import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useEconomyIndustry from "../../../hooks/overpass/useEconomyIndustry";
import Overpass from "../../map/OverpassLayer";
import { iconMap } from "../../map/economy/Industry"; // Ensure you have an iconMap for industry

export function Industry({
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
  const { data, isLoading } = useEconomyIndustry(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = Overpass(map, data, iconMap, "industrial");
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data]);

  return (
    <div id="legend-content">
      <div id="legend-content">
        {isLoading && <p className="search-loading-icon">🔍</p>}
        {data && (
          <small>
            {data?.elements.length} Industrial Features found in{" "}
            {activeAdministrativeRegion["country"]}
          </small>
        )}
        {data &&
          data?.elements.map((element, index) => {
            return (
              <div key={index}>
                <AtlasOSMInfoCard element={element} map={map} />
                <br />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Industry;
