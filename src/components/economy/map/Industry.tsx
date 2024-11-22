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

  isClustered,
  setIsClustered,
}) {
  const { data, isLoading } = useEconomyIndustry(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = Overpass(map, data, iconMap, "industrial", isClustered);
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

  return (
    <div id="legend-content">
      <div id="legend-content">
        <button type="button" onClick={() => setIsClustered(!isClustered)}>
          {isClustered ? "🚀" : "🐢"}
        </button>
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
              <div key={index} className="overpass-item">
                <AtlasOSMInfoCard element={element} map={map} />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Industry;
