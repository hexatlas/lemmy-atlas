import { useEffect } from "react";
import useOverpassLayer from "../../map/useOverpassLayer";
import useEconomyIndustry from "../../../hooks/overpass/useEconomyIndustry";

import { iconMap } from "../../map/economy/Industry";
import AtlasOSMInfoList from "../../shared/AtlasOSMInfoList";

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
      layerObjects = useOverpassLayer(map, data, iconMap, "industrial", isClustered);
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
          <AtlasOSMInfoList
            listName={"Industrial Features"}
            map={map}
            data={data}
            iconMap={iconMap}
            activeAdministrativeRegion={activeAdministrativeRegion}
            filterKeys={["industrial"]}
          ></AtlasOSMInfoList>
        )}
      </div>
    </div>
  );
}

export default Industry;
