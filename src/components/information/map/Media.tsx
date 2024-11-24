import { useEffect } from "react";
import useOverpassLayer from "../../map/useOverpassLayer";
import useInformationMedia from "../../../hooks/overpass/useInformationMedia";

import { iconMap } from "../../map/information/Media";
import AtlasOSMInfoList from "../../shared/AtlasOSMInfoList";

export function Media({
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
  const { data, isLoading } = useInformationMedia(activeAdministrativeRegion); // Updated hook

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = useOverpassLayer(map, data, iconMap, "communication", isClustered); // Updated to "media"
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
          listName={"Media Features"}
          map={map}
          data={data}
          iconMap={iconMap}
          activeAdministrativeRegion={activeAdministrativeRegion}
          filterKeys={["communication"]}
        ></AtlasOSMInfoList>
      )}
    </div>
  );
}

export default Media;
