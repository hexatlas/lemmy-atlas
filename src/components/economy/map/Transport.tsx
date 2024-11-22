import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useEconomyTransport from "../../../hooks/overpass/useEconomyTransport";
import Overpass from "../../map/OverpassLayer";
import { iconMap } from "../../map/economy/Transport";

function Transport({
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
  const { data, isLoading } = useEconomyTransport(activeAdministrativeRegion);

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = Overpass(map, data, iconMap, "railway", isClustered);
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
        <small>
          {data?.elements.length} Railway Stations found in{" "}
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
  );
}

export default Transport;
