// https://www.radix-ui.com/primitives/docs/components/collapsible
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoList from "../../shared/AtlasOSMInfoList";
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
        <AtlasOSMInfoList
          listName={"Power Plants"}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={[
            "plant:source",
            "plant:output:electricity",
            "power",
            "plant:method",
            "plant:type",
            "start_date",
            "operator",
          ]}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Energy;
