import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect } from "react";
import AtlasOSMInfoCard from "../../shared/AtlasOSMInfoCard";
import useInformationMedia from "../../../hooks/overpass/useInformationMedia"; // Updated hook import
import Overpass from "../../map/OverpassLayer";
import { iconMap } from "../../map/information/Media"; // Ensure you have an iconMap for Information/Media

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
}) {
  const { data, isLoading } = useInformationMedia(activeAdministrativeRegion); // Updated hook

  useEffect(() => {
    let layerObjects;
    if (map && data) {
      layerObjects = Overpass(map, data, iconMap, "communication"); // Updated to "media"
    }
    return () => {
      if (layerObjects) {
        map.removeLayer(layerObjects.overpassLayer);
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
          {data?.elements.length} Media Features found in{" "}
          {activeAdministrativeRegion["country"]}
        </small>
      )}
      {data &&
        data?.elements.map((element, index) => {
          return (
            <div key={index}>
              <AtlasOSMInfoCard element={element} />
              {element?.bounds && (
                <button type="button" onClick={() => showOnMap(element?.bounds)}>
                  📍
                </button>
              )}
              <br />
            </div>
          );
        })}
    </div>
  );
}

export default Media;
