// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useEconomyEnergy from "../../../hooks/overpass/useEconomyEnergy";
import useOverpassLayer from "../../map/useOverpassLayer";
import L from "leaflet";
import { iconMap } from "../../map/economy/Energy";

export function Energy({
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
  const { data, isLoading } = useEconomyEnergy(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(map, data, iconMap, "plant:source", isClustered);
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
      }
    };
  }, [map, data, isClustered]);

  return (
    <div id="legend-content">
      <button type="button" onClick={() => setIsClustered(!isClustered)}>
        {isClustered ? "🚀" : "🐢"}
      </button>
      {isLoading && <p className="search-loading-icon">🔍</p>}
      {data && (
        <small>
          {data?.elements.length} Power Plants found in{" "}
          {activeAdministrativeRegion["country"]}
        </small>
      )}
      {data &&
        data?.elements.map((element, index) => {
          return (
            <AtlasOSMInfoCard
              key={index}
              element={element}
              map={map}
              iconMap={iconMap}
              filterKeys={[
                "plant:source",
                "power",
                "plant:output:electricity",
                "plant:method",
                "plant:type",
                "operator",
              ]}
            ></AtlasOSMInfoCard>
          );
        })}
    </div>
  );
}

export default Energy;
